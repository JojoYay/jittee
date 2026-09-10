import { randomBytes } from 'node:crypto'
import { after, NextRequest, NextResponse } from 'next/server'
import { getStripeForSessionId, resolveCheckoutSku } from '@/lib/minorwire/stripe'
import { requireCreds } from '@/lib/minorwire/provision/client'
import type { OciCredentials } from '@/lib/minorwire/provision/types'
import {
  createJobDoc,
  findActiveJobForSession,
  findCompletedJobForSession,
  getJob,
  toPublicStatus,
  appendJobLog,
  updateJob,
} from '@/lib/minorwire/jobs/store'
import { encryptSecret } from '@/lib/minorwire/jobs/crypto'
import { triggerJobRun } from '@/lib/minorwire/jobs/triggerRun'
import { redactFingerprint, redactOcid } from '@/lib/minorwire/jobs/redact'

export const runtime = 'nodejs'
export const maxDuration = 60

function internalSecret(): string {
  return (
    process.env.MINORWIRE_JOB_RUN_SECRET ||
    process.env.MINORWIRE_FULFILLMENT_SECRET ||
    process.env.MINORWIRE_DOWNLOAD_SECRET ||
    ''
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      sessionId?: string
      peerName?: string
      region?: string
      tenancyOcid?: string
      compartmentOcid?: string
      userOcid?: string
      fingerprint?: string
      privateKeyPem?: string
    }

    const sessionId = body.sessionId?.trim()
    if (!sessionId?.startsWith('cs_')) {
      return NextResponse.json({ error: 'Valid Stripe session_id required' }, { status: 400 })
    }

    const stripe = getStripeForSessionId(sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 })
    }
    const sku = await resolveCheckoutSku(stripe, session)
    if (!sku) {
      return NextResponse.json({ error: 'Unknown purchase' }, { status: 403 })
    }

    // One successful provision per Stripe Checkout session (one paid server).
    const completed = await findCompletedJobForSession(sessionId)
    if (completed) {
      return NextResponse.json({
        job: toPublicStatus(completed),
        locked: true,
        message: 'This purchase already provisioned one OCI server. You can still add more device .conf files.',
      })
    }

    const existing = await findActiveJobForSession(sessionId)
    if (existing && existing.phase !== 'done' && existing.phase !== 'error') {
      return NextResponse.json({
        job: toPublicStatus(existing),
        needsClientKick: existing.phase === 'queued',
      })
    }
    // phase === error: allow one retry under the same paid session

    const tenancyOcid = body.tenancyOcid ?? ''
    const creds: OciCredentials = {
      region: body.region ?? '',
      tenancyOcid,
      // Simple admin path: root compartment is the tenancy OCID
      compartmentOcid: body.compartmentOcid?.trim() || tenancyOcid,
      userOcid: body.userOcid ?? '',
      fingerprint: body.fingerprint ?? '',
      privateKeyPem: body.privateKeyPem ?? '',
    }
    try {
      requireCreds(creds)
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Invalid credentials' },
        { status: 400 },
      )
    }

    const peerName = (body.peerName || 'device1').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'device1'
    const jobId = `mw_${randomBytes(8).toString('hex')}`
    const payloadEnc = encryptSecret(JSON.stringify({ creds, peerName }))
    await createJobDoc({ id: jobId, sessionId, sku, payloadEnc, peerName })
    await appendJobLog(jobId, {
      level: 'info',
      step: 'create',
      message: `Accepted provision request region=${creds.region} tenancy=${redactOcid(creds.tenancyOcid)} user=${redactOcid(creds.userOcid)} fp=${redactFingerprint(creds.fingerprint)} peer=${peerName}`,
      phase: 'queued',
    })

    const runSecret = internalSecret()
    if (!runSecret) {
      await updateJob(jobId, {
        phase: 'error',
        message: 'Failed',
        error: 'Server misconfigured (job run secret)',
      })
      return NextResponse.json({ error: 'Server misconfigured (job run secret)' }, { status: 500 })
    }

    // Backup path: keep running after the create response when the platform supports it.
    // Primary path is the browser POST to /run (needsClientKick) which gets its own
    // Cloud Run CPU budget — request-only CPU freezes void fetch() after create returns.
    // IMPORTANT: after() must be given a Promise (do not void an async IIFE).
    after(async () => {
      await appendJobLog(jobId, {
        level: 'info',
        step: 'after_trigger',
        message: 'Server after() starting in-process trigger',
        phase: 'queued',
      })
      try {
        const result = await triggerJobRun(jobId)
        await appendJobLog(jobId, {
          level: result.started ? 'info' : 'warn',
          step: 'after_trigger',
          message: `after() trigger finished started=${result.started} reason=${result.reason || ''}`,
          phase: result.started ? 'validating' : 'queued',
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        await appendJobLog(jobId, {
          level: 'error',
          step: 'after_trigger',
          message: `after() trigger threw: ${msg}`,
          phase: 'queued',
        })
      }
    })

    const job = await getJob(jobId)
    return NextResponse.json({
      job: job ? toPublicStatus(job) : { id: jobId, phase: 'queued' },
      needsClientKick: true,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create job'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
