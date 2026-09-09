import type { OciCredentials } from './types'
import { createClients } from './client'

export type ValidateResult = {
  userName: string
  userOcid: string
  availabilityDomains: string[]
  region: string
}

export async function validateCredentials(creds: OciCredentials): Promise<ValidateResult> {
  const { identity } = createClients(creds)
  const user = await identity.getUser({ userId: creds.userOcid.trim() })
  const ads = await identity.listAvailabilityDomains({ compartmentId: creds.tenancyOcid.trim() })
  const names = (ads.items ?? []).map((ad) => ad.name).filter((n): n is string => Boolean(n))
  if (!names.length) {
    throw new Error('No availability domains returned for this tenancy/region')
  }
  return {
    userName: user.user.name ?? creds.userOcid,
    userOcid: user.user.id,
    availabilityDomains: names,
    region: creds.region,
  }
}
