import { after, NextRequest, NextResponse } from 'next/server'
import {
  appendJobLog,
  getJob,
  recoverStuckQueuedJob,
  toPublicStatus,
  updateJob,
} from '@/lib/minorwire/jobs/store'
import { getStripeForSessionId } from '@/lib/minorwire/stripe'
import { triggerJobRun } from '@/lib/minorwire/jobs/triggerRun'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const sessionId = req.nextUrl.searchParams.get('session_id')?.trim()
    if (!sessionId?.startsWith('cs_')) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    }

    const stripe = getStripeForSessionId(sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 })
    }

    let job = await getJob(id)
    if (!job || job.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    job = await recoverStuckQueuedJob(job)

    // Re-kick stuck queued jobs that still have an encrypted payload.
    if (job.phase === 'queued' && job.payloadEnc) {
      const lastKick = job.lastKickAt || job.createdAt
      if (Date.now() - lastKick > 15_000) {
        await updateJob(id, { lastKickAt: Date.now() })
        await appendJobLog(id, {
          level: 'info',
          step: 'rekick',
          message: 'Status poll scheduling re-kick for queued job',
          phase: 'queued',
        })
        after(async () => {
          try {
            await triggerJobRun(id)
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            await appendJobLog(id, {
              level: 'error',
              step: 'rekick',
              message: msg,
              phase: 'queued',
            })
          }
        })
      }
    }

    job = (await getJob(id)) || job
    return NextResponse.json({
      job: toPublicStatus(job),
      needsClientKick: job.phase === 'queued' && Boolean(job.payloadEnc),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
