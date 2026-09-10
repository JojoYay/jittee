import { NextRequest, NextResponse } from 'next/server'
import type { OciCredentials } from '@/lib/minorwire/provision/types'
import { appendJobLog, getJob, updateJob } from '@/lib/minorwire/jobs/store'
import { triggerJobRun } from '@/lib/minorwire/jobs/triggerRun'

export const runtime = 'nodejs'
export const maxDuration = 3600

function internalSecret(): string {
  return (
    process.env.MINORWIRE_JOB_RUN_SECRET ||
    process.env.MINORWIRE_FULFILLMENT_SECRET ||
    process.env.MINORWIRE_DOWNLOAD_SECRET ||
    ''
  )
}

async function assertSessionOwnsJob(sessionId: string, jobSessionId: string): Promise<boolean> {
  if (!sessionId.startsWith('cs_') || sessionId !== jobSessionId) return false
  const { getStripeForSessionId } = await import('@/lib/minorwire/stripe')
  const stripe = getStripeForSessionId(sessionId)
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const expected = internalSecret()
  const provided = req.headers.get('x-minorwire-job-secret') ?? ''
  const body = (await req.json().catch(() => ({}))) as {
    creds?: OciCredentials
    peerName?: string
    sessionId?: string
  }

  const job = await getJob(id)
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const secretOk = Boolean(expected && provided === expected)
  const sessionOk = body.sessionId
    ? await assertSessionOwnsJob(body.sessionId.trim(), job.sessionId)
    : false

  if (!secretOk && !sessionOk) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (job.phase !== 'queued') {
    return NextResponse.json({ ok: true, skipped: 'not_queued', phase: job.phase })
  }

  await appendJobLog(id, {
    level: 'info',
    step: 'run_route',
    message: secretOk ? 'Run accepted (internal secret)' : 'Run accepted (checkout session)',
    phase: 'queued',
  })
  await updateJob(id, { lastKickAt: Date.now() })

  // Long-running on this request's Cloud Run CPU budget (up to maxDuration).
  const result = await triggerJobRun(
    id,
    body.creds
      ? { creds: body.creds, peerName: body.peerName || job.peerName || 'device1' }
      : undefined,
  )

  return NextResponse.json({ ok: true, ...result })
}
