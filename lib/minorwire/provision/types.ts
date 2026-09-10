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

export type PeerConfRecord = {
  name: string
  conf: string
  createdAt: number
}

export type JobLogEntry = {
  at: number
  level: 'info' | 'warn' | 'error'
  step: string
  message: string
  phase?: JobPhase
}

export type JobPublicStatus = {
  id: string
  phase: JobPhase
  message: string
  createdAt: number
  updatedAt: number
  sessionId: string
  publicIp?: string
  /** OCI Compute instance displayName (e.g. minorwire-a1b2c3). */
  displayName?: string
  peerName?: string
  peerConf?: string
  peers?: PeerConfRecord[]
  error?: string
  /** Recent structured steps for support / setup UI (secrets redacted). */
  logs?: JobLogEntry[]
  /** True when the customer may resubmit credentials for this purchase. */
  canRetry?: boolean
  /** True when OCI server provision already succeeded for this purchase. */
  serverProvisioned?: boolean
}
