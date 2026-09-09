import type { OciCredentials } from '../provision/types'
import { validateCredentials } from '../provision/validate'
import { provisionAlwaysFreeVpn } from '../provision/provision'
import { bootstrapWireGuard, addPeerAndFetchConfig } from '../provision/ssh'
import { updateJob } from '../jobs/store'

export async function runProvisionJob(opts: {
  jobId: string
  creds: OciCredentials
  peerName: string
}): Promise<void> {
  const { jobId, creds } = opts
  const peerName = opts.peerName || 'device1'

  try {
    await updateJob(jobId, { phase: 'validating', message: 'Validating OCI credentials' })
    await validateCredentials(creds)

    await updateJob(jobId, { phase: 'provisioning', message: 'Creating VCN and Always Free Micro' })
    const provisioned = await provisionAlwaysFreeVpn(creds)
    await updateJob(jobId, {
      phase: 'bootstrapping',
      message: `Instance running at ${provisioned.publicIp}; installing WireGuard`,
      publicIp: provisioned.publicIp,
    })

    await bootstrapWireGuard({
      host: provisioned.publicIp,
      privateKeyPem: provisioned.sshPrivateKeyPem,
      publicIp: provisioned.publicIp,
    })

    await updateJob(jobId, { phase: 'peer', message: `Creating peer config (${peerName})` })
    const peerConf = await addPeerAndFetchConfig({
      host: provisioned.publicIp,
      privateKeyPem: provisioned.sshPrivateKeyPem,
      peerName,
    })

    await updateJob(jobId, {
      phase: 'done',
      message: 'Ready — import the config into the official WireGuard app',
      publicIp: provisioned.publicIp,
      peerName,
      peerConf,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    await updateJob(jobId, {
      phase: 'error',
      message: 'Failed',
      error: message.slice(0, 2000),
    })
  }
}
