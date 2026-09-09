import { NextRequest, NextResponse } from 'next/server'
import { getJob, toPublicStatus } from '@/lib/minorwire/jobs/store'
import { getStripeForSessionId } from '@/lib/minorwire/stripe'

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

    const job = await getJob(id)
    if (!job || job.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({ job: toPublicStatus(job) })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
