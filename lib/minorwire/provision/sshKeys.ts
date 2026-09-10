import { generateKeyPairSync } from 'node:crypto'
import { utils as ssh2Utils } from 'ssh2'
import sshpk from 'sshpk'

/**
 * ssh2 cannot parse Node PKCS#8 ed25519 PEM (`BEGIN PRIVATE KEY`).
 * Always store / pass OpenSSH private key material (`BEGIN OPENSSH PRIVATE KEY`).
 */
export function toSsh2PrivateKey(material: string): string {
  const trimmed = material.trim()
  if (!trimmed) {
    throw new Error('Empty instance SSH private key')
  }
  const direct = ssh2Utils.parseKey(trimmed)
  if (!(direct instanceof Error)) {
    return trimmed
  }
  try {
    const openssh = sshpk.parsePrivateKey(trimmed, 'pem').toString('openssh')
    const check = ssh2Utils.parseKey(openssh)
    if (check instanceof Error) {
      throw check
    }
    return openssh
  } catch {
    throw new Error(`Cannot parse privateKey: ${direct.message}`)
  }
}

export function isUsableInstanceSshKey(material: string | undefined | null): boolean {
  if (!material?.trim()) return false
  try {
    toSsh2PrivateKey(material)
    return true
  } catch {
    return false
  }
}

export function generateInstanceSshKeyPair(): {
  publicKeyOpenSsh: string
  privateKeyPem: string
} {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  const privatePkcs8 = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  const privateKeyPem = toSsh2PrivateKey(privatePkcs8)
  const pubPem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
  const key = sshpk.parseKey(pubPem, 'pem')
  const publicKeyOpenSsh = key.toString('ssh')
  return { publicKeyOpenSsh, privateKeyPem }
}
