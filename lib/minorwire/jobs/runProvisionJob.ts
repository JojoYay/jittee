import type { OciCredentials } from '../provision/types'
import { validateCredentials } from '../provision/validate'
import { provisionAlwaysFreeVpn } from '../provision/provision'
import { bootstrapWireGuard, addPeerAndFetchConfig } from '../provision/ssh'
import { appendJobLog, getJob, updateJob } from '../jobs/store'
import { decryptSecret, encryptSecret } from '../jobs/crypto'
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

    const existing = await getJob(jobId)
    let publicIp = existing?.publicIp?.trim() || ''
    let sshPrivateKeyPem = ''
    if (publicIp && existing?.sshPrivateKeyEnc) {
      try {
        sshPrivateKeyPem = decryptSecret(existing.sshPrivateKeyEnc)
      } catch {
        sshPrivateKeyPem = ''
      }
    }

    if (publicIp && sshPrivateKeyPem.includes('PRIVATE KEY')) {
      await updateJob(jobId, {
        phase: 'bootstrapping',
        message: `Resuming WireGuard install on ${publicIp}`,
        publicIp,
      })
      await appendJobLog(jobId, {
        level: 'info',
        step: 'provision',
        message: `Resuming existing instance ip=${publicIp} (skip OCI create)`,
        phase: 'bootstrapping',
      })
    } else {
      await updateJob(jobId, { phase: 'provisioning', message: 'Creating VCN and Always Free Micro' })
      await appendJobLog(jobId, {
        level: 'info',
        step: 'provision',
        message: 'Creating VCN / subnet / Always Free Micro instance',
        phase: 'provisioning',
      })
      const provisioned = await provisionAlwaysFreeVpn(creds)
      publicIp = provisioned.publicIp
      sshPrivateKeyPem = provisioned.sshPrivateKeyPem
      // Persist SSH key before bootstrap so a later retry can resume without creating another instance.
      await updateJob(jobId, {
        phase: 'bootstrapping',
        message: `Instance running at ${publicIp}; installing WireGuard`,
        publicIp,
        sshPrivateKeyEnc: encryptSecret(sshPrivateKeyPem),
      })
      await appendJobLog(jobId, {
        level: 'info',
        step: 'provision',
        message: `Instance ready ip=${publicIp} id=${redactOcid(provisioned.instanceId)}`,
        phase: 'bootstrapping',
      })
    }

    await appendJobLog(jobId, {
      level: 'info',
      step: 'wg_bootstrap',
      message: `SSH bootstrap WireGuard on ${publicIp}`,
      phase: 'bootstrapping',
    })
    await bootstrapWireGuard({
      host: publicIp,
      privateKeyPem: sshPrivateKeyPem,
      publicIp,
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
      host: publicIp,
      privateKeyPem: sshPrivateKeyPem,
      peerName,
    })

    const now = Date.now()
    await updateJob(jobId, {
      phase: 'done',
      message: 'Server ready — add more device configs anytime for this purchase',
      publicIp,
      peerName,
      peerConf,
      peers: [{ name: peerName, conf: peerConf, createdAt: now }],
      sshPrivateKeyEnc: encryptSecret(sshPrivateKeyPem),
    })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'done',
      message: `Provision complete ip=${publicIp} peer=${peerName}`,
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
