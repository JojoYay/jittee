/** OCI regions offered in the setup form (Always Free Micro is home-region only). */
export const REGION_OPTIONS = [
  { id: 'ap-tokyo-1', name: 'Japan East (Tokyo)' },
  { id: 'ap-singapore-1', name: 'Singapore' },
  { id: 'ap-osaka-1', name: 'Japan Central (Osaka)' },
  { id: 'ap-seoul-1', name: 'South Korea Central (Seoul)' },
  { id: 'ap-sydney-1', name: 'Australia East (Sydney)' },
  { id: 'ap-mumbai-1', name: 'India West (Mumbai)' },
  { id: 'us-ashburn-1', name: 'US East (Ashburn)' },
  { id: 'us-phoenix-1', name: 'US West (Phoenix)' },
  { id: 'eu-frankfurt-1', name: 'Germany Central (Frankfurt)' },
  { id: 'uk-london-1', name: 'UK South (London)' },
] as const

export type OciRegionId = (typeof REGION_OPTIONS)[number]['id']

/** UI language → suggested home / VPN region. */
export function defaultRegionForLocale(locale: string): OciRegionId {
  if (locale === 'ja') return 'ap-tokyo-1'
  return 'ap-singapore-1'
}

export function isKnownRegion(region: string): boolean {
  return REGION_OPTIONS.some((r) => r.id === region)
}
