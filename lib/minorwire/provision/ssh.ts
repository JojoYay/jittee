import { Client, type ConnectConfig } from 'ssh2'
import { readFileSync } from 'node:fs'
import { resolvePrivateAsset } from '../privateAssets'
import { toSsh2PrivateKey } from './sshKeys'

function connect(cfg: ConnectConfig): Promise<Client> {
  return new Promise((resolvePromise, reject) => {
    const client = new Client()
    client
      .on('ready', () => resolvePromise(client))
      .on('error', reject)
      .connect(cfg)
  })
}

function exec(client: Client, command: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolvePromise, reject) => {
    client.exec(command, (err, stream) => {
      if (err) return reject(err)
      let stdout = ''
      let stderr = ''
      stream
        .on('close', (code: number) => resolvePromise({ code: code ?? 0, stdout, stderr }))
        .on('data', (d: Buffer) => {
          stdout += d.toString('utf8')
        })
      stream.stderr.on('data', (d: Buffer) => {
        stderr += d.toString('utf8')
      })
    })
  })
}

function uploadBuffer(client: Client, data: Buffer, remotePath: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    client.sftp((err, sftp) => {
      if (err) return reject(err)
      const stream = sftp.createWriteStream(remotePath)
      stream.on('error', reject)
      stream.on('close', () => resolvePromise())
      stream.end(data)
    })
  })
}

function downloadString(client: Client, remotePath: string): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    client.sftp((err, sftp) => {
      if (err) return reject(err)
      const chunks: Buffer[] = []
      const stream = sftp.createReadStream(remotePath)
      stream.on('data', (d: Buffer) => chunks.push(d))
      stream.on('error', reject)
      stream.on('close', () => resolvePromise(Buffer.concat(chunks).toString('utf8')))
    })
  })
}

async function withRetryConnect(cfg: ConnectConfig, attempts = 30): Promise<Client> {
  let last: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await connect(cfg)
    } catch (e) {
      last = e
      await new Promise((r) => setTimeout(r, 10_000))
    }
  }
  throw last instanceof Error ? last : new Error(String(last))
}

export async function bootstrapWireGuard(opts: {
  host: string
  privateKeyPem: string
  publicIp: string
  scriptPath?: string
}): Promise<void> {
  const scriptPath = opts.scriptPath
    ? opts.scriptPath
    : resolvePrivateAsset('minorwire', 'wg-setup.sh')
  const script = readFileSync(scriptPath)
  const client = await withRetryConnect({
    host: opts.host,
    port: 22,
    username: 'ubuntu',
    privateKey: toSsh2PrivateKey(opts.privateKeyPem),
    readyTimeout: 30_000,
  })
  try {
    await uploadBuffer(client, script, '/home/ubuntu/wg-setup.sh')
    const run = await exec(
      client,
      `sed -i "s/\\r$//" /home/ubuntu/wg-setup.sh && sudo env PUBLIC_IP=${opts.publicIp} bash /home/ubuntu/wg-setup.sh && sudo wg show`,
    )
    if (run.code !== 0) {
      throw new Error(`wg-setup.sh failed with exit ${run.code}: ${run.stderr || run.stdout}`)
    }
  } finally {
    client.end()
  }
}

export async function addPeerAndFetchConfig(opts: {
  host: string
  privateKeyPem: string
  peerName: string
}): Promise<string> {
  if (!/^[A-Za-z0-9_-]+$/.test(opts.peerName)) {
    throw new Error('peer name must be alphanumeric / - / _')
  }
  const client = await connect({
    host: opts.host,
    port: 22,
    username: 'ubuntu',
    privateKey: toSsh2PrivateKey(opts.privateKeyPem),
  })
  try {
    const add = await exec(client, `sudo wg-add-peer ${opts.peerName}`)
    if (add.code !== 0) {
      throw new Error(`wg-add-peer failed with exit ${add.code}: ${add.stderr || add.stdout}`)
    }
    await exec(
      client,
      `sudo cp /etc/wireguard/clients/${opts.peerName}.conf /home/ubuntu/${opts.peerName}.conf && sudo chown ubuntu:ubuntu /home/ubuntu/${opts.peerName}.conf`,
    )
    return await downloadString(client, `/home/ubuntu/${opts.peerName}.conf`)
  } finally {
    client.end()
  }
}
