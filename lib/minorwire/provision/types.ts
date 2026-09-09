export type OciCredentials = {
  region: string
  tenancyOcid: string
  compartmentOcid: string
  userOcid: string
  fingerprint: string
  /** PEM private key contents (never persist). */
  privateKeyPem: string
}

export type ProvisionResult = {
  instanceId: string
  displayName: string
  publicIp: string
  privateIp: string
  availabilityDomain: string
  subnetId: string
  vcnId: string
  region: string
  /** Ephemeral SSH private key PEM for the instance (memory only). */
  sshPrivateKeyPem: string
}

export type JobPhase =
  | 'queued'
  | 'validating'
  | 'provisioning'
  | 'bootstrapping'
  | 'peer'
  | 'done'
  | 'error'

export type JobPublicStatus = {
  id: string
  phase: JobPhase
  message: string
  createdAt: number
  updatedAt: number
  sessionId: string
  publicIp?: string
  peerName?: string
  peerConf?: string
  error?: string
}
