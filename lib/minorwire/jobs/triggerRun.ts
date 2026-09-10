import type { OciCredentials } from '../provision/types'
import { decryptSecret } from './crypto'
import { appendJobLog, claimQueuedJob, clearJobPayload, getJob, updateJob } from './store'
import { runProvisionJob } from './runProvisionJob'

export type JobRunPayload = {
  creds: OciCredentials
  peerName: string
}

export function parseJobPayload(raw: string): JobRunPayload {
  const parsed = JSON.parse(raw) as JobRunPayload
  if (!parsed?.creds || typeof parsed.creds !== 'object') {
    throw new Error('Invalid stored job payload')
  }
  return {
    creds: parsed.creds,
    peerName: (parsed.peerName || 'device1').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'device1',
  }
}

/**
 * Atomically claim a queued job and run provisioning.
 * Safe to call concurrently (claim wins once).
 */
export async function triggerJobRun(
  jobId: string,
  inlinePayload?: JobRunPayload,
): Promise<{ started: boolean; reason?: string }> {
  const existing = await getJob(jobId)
  if (!existing) return { started: false, reason: 'not_found' }
  if (existing.phase !== 'queued') return { started: false, reason: 'not_queued' }

  let payload = inlinePayload
  if (!payload) {
    if (!existing.payloadEnc) {
      await appendJobLog(jobId, {
        level: 'error',
        step: 'trigger',
        message: 'No payload to run; marking error so customer can resubmit',
        phase: 'error',
      })
      await updateJob(jobId, {
        phase: 'error',
        message: 'Failed',
        error: 'Provision runner never received credentials. Please submit the form again.',
      })
      return { started: false, reason: 'missing_payload' }
    }
    try {
      payload = parseJobPayload(decryptSecret(existing.payloadEnc))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      await updateJob(jobId, {
        phase: 'error',
        message: 'Failed',
        error: `Could not decrypt job payload: ${msg}`.slice(0, 2000),
      })
      await clearJobPayload(jobId)
      return { started: false, reason: 'decrypt_failed' }
    }
  }

  const claimed = await claimQueuedJob(jobId)
  if (!claimed) return { started: false, reason: 'claim_lost' }

  await appendJobLog(jobId, {
    level: 'info',
    step: 'trigger',
    message: 'Job claimed; provision starting',
    phase: 'validating',
  })

  try {
    await runProvisionJob({
      jobId,
      creds: payload.creds,
      peerName: payload.peerName,
      alreadyClaimed: true,
    })
  } finally {
    await clearJobPayload(jobId)
  }

  return { started: true }
}
