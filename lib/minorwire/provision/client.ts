import * as common from 'oci-common'
import * as identity from 'oci-identity'
import * as core from 'oci-core'
import type { OciCredentials } from './types'

export type OciClients = {
  identity: identity.IdentityClient
  compute: core.ComputeClient
  network: core.VirtualNetworkClient
}

export function requireCreds(creds: OciCredentials): void {
  const missing: string[] = []
  if (!creds.region?.trim()) missing.push('region')
  if (!creds.tenancyOcid?.trim()) missing.push('tenancyOcid')
  if (!creds.userOcid?.trim()) missing.push('userOcid')
  if (!creds.compartmentOcid?.trim()) missing.push('compartmentOcid')
  if (!creds.fingerprint?.trim()) missing.push('fingerprint')
  if (!creds.privateKeyPem?.trim()) missing.push('privateKeyPem')
  if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`)
  if (!creds.privateKeyPem.includes('PRIVATE KEY')) {
    throw new Error('privateKeyPem must be a PEM private key')
  }
}

export function createClients(creds: OciCredentials): OciClients {
  requireCreds(creds)
  const region = common.Region.fromRegionId(creds.region.trim())
  const provider = new common.SimpleAuthenticationDetailsProvider(
    creds.tenancyOcid.trim(),
    creds.userOcid.trim(),
    creds.fingerprint.trim(),
    creds.privateKeyPem.trim(),
    null,
    region,
  )
  return {
    identity: new identity.IdentityClient({ authenticationDetailsProvider: provider }),
    compute: new core.ComputeClient({ authenticationDetailsProvider: provider }),
    network: new core.VirtualNetworkClient({ authenticationDetailsProvider: provider }),
  }
}
