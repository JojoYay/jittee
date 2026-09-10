export type ParsedOciConfig = {
  userOcid: string
  fingerprint: string
  tenancyOcid: string
  region: string
}

function configValue(text: string, key: string): string {
  const re = new RegExp(`^\\s*${key}\\s*=\\s*(.+?)\\s*(?:#.*)?$`, 'im')
  const m = text.match(re)
  return (m?.[1] ?? '').trim()
}

/** Parse OCI CLI/SDK config snippet from Configuration file preview (Copy). */
export function parseOciConfig(text: string): ParsedOciConfig | null {
  const raw = text.trim()
  if (!raw) return null

  const userOcid = configValue(raw, 'user')
  const fingerprint = configValue(raw, 'fingerprint')
  const tenancyOcid = configValue(raw, 'tenancy')
  const region = configValue(raw, 'region')

  if (!userOcid.startsWith('ocid1.user.')) return null
  if (!tenancyOcid.startsWith('ocid1.tenancy.')) return null
  if (!/^[0-9a-f]{2}(:[0-9a-f]{2}){15}$/i.test(fingerprint)) return null
  if (!region) return null

  return { userOcid, fingerprint, tenancyOcid, region }
}
