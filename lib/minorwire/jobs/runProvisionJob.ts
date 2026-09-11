import type { OciCredentials } from '../provision/types'
import { validateCredentials } from '../provision/validate'
import { provisionAlwaysFreeVpn } from '../provision/provision'
import { bootstrapWireGuard, addPeerAndFetchConfig } from '../provision/ssh'
import { isUsableInstanceSshKey, toSsh2PrivateKey } from '../provision/sshKeys'
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
    // Persist encrypted OCI API creds for later recreate (same AES-GCM as other secrets).
    // payloadEnc remains ephemeral and is cleared after the run.
    await updateJob(jobId, {
      ociCredsEnc: encryptSecret(JSON.stringify(creds)),
    })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'validate_creds',
      message: 'OCI credentials OK (encrypted API key retained for recreate)',
      phase: 'validating',
    })

    const existing = await getJob(jobId)
    let publicIp = existing?.publicIp?.trim() || ''
    let displayName = existing?.displayName?.trim() || ''
    let sshPrivateKeyPem = ''
    if (publicIp && existing?.sshPrivateKeyEnc) {
      try {
        sshPrivateKeyPem = toSsh2PrivateKey(decryptSecret(existing.sshPrivateKeyEnc))
      } catch {
        sshPrivateKeyPem = ''
      }
    }

    const canResume = Boolean(publicIp && isUsableInstanceSshKey(sshPrivateKeyPem))
    if (publicIp && !canResume) {
      await appendJobLog(jobId, {
        level: 'warn',
        step: 'provision',
        message: `Stored instance SSH key unusable for resume (ip=${publicIp}); cleaning and recreating`,
        phase: 'provisioning',
      })
      publicIp = ''
      displayName = ''
      sshPrivateKeyPem = ''
      await updateJob(jobId, {
        publicIp: '',
        displayName: '',
        sshPrivateKeyEnc: '',
      })
    }

    if (canResume) {
      await updateJob(jobId, {
        phase: 'bootstrapping',
        message: `Resuming WireGuard install on ${publicIp}`,
        publicIp,
        ...(displayName ? { displayName } : {}),
        sshPrivateKeyEnc: encryptSecret(sshPrivateKeyPem),
      })
      await appendJobLog(jobId, {
        level: 'info',
        step: 'provision',
        message: `Resuming existing instance ip=${publicIp} (skip OCI create)`,
        phase: 'bootstrapping',
      })
    } else {
      await updateJob(jobId, {
        phase: 'provisioning',
        message: 'Cleaning prior MinorWire resources, then creating VCN and Always Free Micro',
      })
      await appendJobLog(jobId, {
        level: 'info',
        step: 'provision',
        message:
          'Cleaning prior minorwire-* resources if any, then creating VCN / subnet / Always Free Micro',
        phase: 'provisioning',
      })
      const provisioned = await provisionAlwaysFreeVpn(creds, {
        onLog: async (message) => {
          await appendJobLog(jobId, {
            level: 'info',
            step: 'provision_cleanup',
            message,
            phase: 'provisioning',
          })
        },
      })
      publicIp = provisioned.publicIp
      displayName = provisioned.displayName
      sshPrivateKeyPem = toSsh2PrivateKey(provisioned.sshPrivateKeyPem)
      // Persist SSH key before bootstrap so a later retry can resume without creating another instance.
      await updateJob(jobId, {
        phase: 'bootstrapping',
        message: `Instance running at ${publicIp}; installing WireGuard`,
        publicIp,
        displayName,
        sshPrivateKeyEnc: encryptSecret(sshPrivateKeyPem),
      })
      await appendJobLog(jobId, {
        level: 'info',
        step: 'provision',
        message: `Instance ready name=${displayName} ip=${publicIp} id=${redactOcid(provisioned.instanceId)}`,
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
      ...(displayName ? { displayName } : {}),
      peerName,
      peerConf,
      peers: [{ name: peerName, conf: peerConf, createdAt: now }],
      sshPrivateKeyEnc: encryptSecret(sshPrivateKeyPem),
      ociCredsEnc: encryptSecret(JSON.stringify(creds)),
    })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'done',
      message: `Provision complete name=${displayName || '?'} ip=${publicIp} peer=${peerName}`,
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
