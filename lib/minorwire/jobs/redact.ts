/** Partial redaction for support logs — never log full OCIDs / fingerprints / PEMs. */

export function redactOcid(value: string | undefined | null): string {
  const s = (value || '').trim()
  if (!s) return '(empty)'
  if (s.length <= 12) return `${s.slice(0, 4)}…`
  return `${s.slice(0, 10)}…${s.slice(-4)}`
}

export function redactFingerprint(value: string | undefined | null): string {
  const s = (value || '').trim()
  if (!s) return '(empty)'
  if (s.length <= 10) return `${s.slice(0, 4)}…`
  return `${s.slice(0, 8)}…${s.slice(-4)}`
}

export function redactSecretMessage(message: string): string {
  let out = message
  // PEM blocks
  out = out.replace(/-----BEGIN[\s\S]*?-----END [^-]*-----/g, '[REDACTED_PEM]')
  // Long base64-ish blobs
  out = out.replace(/(?:[A-Za-z0-9+/_-]{80,}={0,2})/g, '[REDACTED_BLOB]')
  // OCIDs
  out = out.replace(
    /ocid1\.[a-z0-9._-]+/gi,
    (m) => redactOcid(m),
  )
  return out.slice(0, 2000)
}
