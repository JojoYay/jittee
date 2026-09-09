import { createHmac, timingSafeEqual } from 'node:crypto'

const DEFAULT_TTL_SEC = 60 * 60 * 24 * 7 // 7 days

function secret(): string {
  const s = process.env.MINORWIRE_DOWNLOAD_SECRET || process.env.STRIPE_SECRET_KEY
  if (!s) throw new Error('MINORWIRE_DOWNLOAD_SECRET or STRIPE_SECRET_KEY is required')
  return s
}

export function createDownloadToken(sessionId: string, ttlSec = DEFAULT_TTL_SEC): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec
  const payload = `${sessionId}.${exp}`
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyDownloadToken(token: string): { sessionId: string } | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [sessionId, expStr, sig] = parts
  const exp = Number(expStr)
  if (!sessionId || !Number.isFinite(exp) || exp * 1000 < Date.now()) return null
  const payload = `${sessionId}.${expStr}`
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  return { sessionId }
}
