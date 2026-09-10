import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

function keyMaterial(): Buffer {
  const secret =
    process.env.MINORWIRE_DOWNLOAD_SECRET ||
    process.env.MINORWIRE_FULFILLMENT_SECRET ||
    process.env.STRIPE_SECRET_KEY
  if (!secret) throw new Error('No secret available to encrypt instance SSH key')
  return createHash('sha256').update(secret).digest()
}

/** Encrypt secrets for Firestore (instance SSH PEM; temporary OCI job payload). */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyMaterial(), iv)
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64url')
}

export function decryptSecret(payload: string): string {
  const buf = Buffer.from(payload, 'base64url')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const data = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', keyMaterial(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}
