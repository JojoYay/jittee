import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getStripe, resolveCheckoutSku } from '@/lib/minorwire/stripe'
import { requireCreds } from '@/lib/minorwire/provision/client'
import type { OciCredentials } from '@/lib/minorwire/provision/types'
import {
  createJobDoc,
  findActiveJobForSession,
  toPublicStatus,
} from '@/lib/minorwire/jobs/store'

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

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 })
    }
    const sku = await resolveCheckoutSku(stripe, session)
    if (!sku) {
      return NextResponse.json({ error: 'Unknown purchase' }, { status: 403 })
    }

    const existing = await findActiveJobForSession(sessionId)
    if (existing && existing.phase !== 'done' && existing.phase !== 'error') {
      return NextResponse.json({ job: toPublicStatus(existing) })
    }
    if (existing?.phase === 'done' && existing.peerConf) {
      return NextResponse.json({ job: toPublicStatus(existing) })
    }

    const creds: OciCredentials = {
      region: body.region ?? '',
      tenancyOcid: body.tenancyOcid ?? '',
      compartmentOcid: body.compartmentOcid ?? '',
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
    await createJobDoc({ id: jobId, sessionId, sku })

    const base = process.env.MINORWIRE_PUBLIC_BASE_URL || 'https://jittee.com'
    const runSecret = internalSecret()
    if (!runSecret) {
      return NextResponse.json({ error: 'Server misconfigured (job run secret)' }, { status: 500 })
    }

    // Separate HTTP request keeps Cloud Run CPU for the long provision.
    void fetch(`${base}/api/minorwire/jobs/${jobId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-minorwire-job-secret': runSecret,
      },
      body: JSON.stringify({ creds, peerName }),
    }).catch(() => {
      /* run endpoint updates job on failure when reachable */
    })

    const { getJob, toPublicStatus: toPublic } = await import('@/lib/minorwire/jobs/store')
    const job = await getJob(jobId)
    return NextResponse.json({ job: job ? toPublic(job) : { id: jobId, phase: 'queued' } })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create job'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
