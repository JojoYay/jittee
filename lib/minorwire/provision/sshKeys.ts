import { generateKeyPairSync } from 'node:crypto'
import sshpk from 'sshpk'

export function generateInstanceSshKeyPair(): { publicKeyOpenSsh: string; privateKeyPem: string } {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  const pubPem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
  const key = sshpk.parseKey(pubPem, 'pem')
  const publicKeyOpenSsh = key.toString('ssh')
  return { publicKeyOpenSsh, privateKeyPem }
}
