import type { OciCredentials } from '../provision/types'
import { validateCredentials } from '../provision/validate'
import { provisionAlwaysFreeVpn } from '../provision/provision'
import { bootstrapWireGuard, addPeerAndFetchConfig } from '../provision/ssh'
import { appendJobLog, updateJob } from '../jobs/store'
import { encryptSecret } from '../jobs/crypto'
import { redactFingerprint, redactOcid, redactSecretMessage } from '../jobs/redact'

export async function runProvisionJob(opts: {
  jobId: string
  creds: OciCredentials
  peerName: string
  /** When true, claimQueuedJob already moved phase to validating. */
  alreadyClaimed?: boolean
}): Promise<void> {
  const { jobId, creds } = opts
  const peerName = opts.peerName || 'device1'

  try {
    if (!opts.alreadyClaimed) {
      await updateJob(jobId, { phase: 'validating', message: 'Validating OCI credentials' })
    }
    await appendJobLog(jobId, {
      level: 'info',
      step: 'validate_creds',
      message: `Validating OCI API key (region=${creds.region}, tenancy=${redactOcid(creds.tenancyOcid)}, user=${redactOcid(creds.userOcid)}, fp=${redactFingerprint(creds.fingerprint)})`,
      phase: 'validating',
    })
    await validateCredentials(creds)
    await appendJobLog(jobId, {
      level: 'info',
      step: 'validate_creds',
      message: 'OCI credentials OK',
      phase: 'validating',
    })

    await updateJob(jobId, { phase: 'provisioning', message: 'Creating VCN and Always Free Micro' })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'provision',
      message: 'Creating VCN / subnet / Always Free Micro instance',
      phase: 'provisioning',
    })
    const provisioned = await provisionAlwaysFreeVpn(creds)
    await updateJob(jobId, {
      phase: 'bootstrapping',
      message: `Instance running at ${provisioned.publicIp}; installing WireGuard`,
      publicIp: provisioned.publicIp,
    })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'provision',
      message: `Instance ready ip=${provisioned.publicIp} id=${redactOcid(provisioned.instanceId)}`,
      phase: 'bootstrapping',
    })

    await appendJobLog(jobId, {
      level: 'info',
      step: 'wg_bootstrap',
      message: `SSH bootstrap WireGuard on ${provisioned.publicIp}`,
      phase: 'bootstrapping',
    })
    await bootstrapWireGuard({
      host: provisioned.publicIp,
      privateKeyPem: provisioned.sshPrivateKeyPem,
      publicIp: provisioned.publicIp,
    })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'wg_bootstrap',
      message: 'WireGuard installed and configured',
      phase: 'bootstrapping',
    })

    await updateJob(jobId, { phase: 'peer', message: `Creating peer config (${peerName})` })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'peer',
      message: `Creating peer config name=${peerName}`,
      phase: 'peer',
    })
    const peerConf = await addPeerAndFetchConfig({
      host: provisioned.publicIp,
      privateKeyPem: provisioned.sshPrivateKeyPem,
      peerName,
    })

    const now = Date.now()
    await updateJob(jobId, {
      phase: 'done',
      message: 'Server ready — add more device configs anytime for this purchase',
      publicIp: provisioned.publicIp,
      peerName,
      peerConf,
      peers: [{ name: peerName, conf: peerConf, createdAt: now }],
      sshPrivateKeyEnc: encryptSecret(provisioned.sshPrivateKeyPem),
    })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'done',
      message: `Provision complete ip=${provisioned.publicIp} peer=${peerName}`,
      phase: 'done',
    })
  } catch (e) {
    const message = redactSecretMessage(e instanceof Error ? e.message : String(e))
    await appendJobLog(jobId, {
      level: 'error',
      step: 'error',
      message,
      phase: 'error',
    })
    await updateJob(jobId, {
      phase: 'error',
      message: 'Failed',
      error: message.slice(0, 2000),
    })
  }
}
