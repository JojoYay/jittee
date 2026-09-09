import { NextRequest, NextResponse } from 'next/server'
import { getStripe, resolveCheckoutSku, customerEmailFromSession } from '@/lib/minorwire/stripe'
import { findActiveJobForSession, toPublicStatus } from '@/lib/minorwire/jobs/store'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')?.trim()
    if (!sessionId?.startsWith('cs_')) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
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
    const job = await findActiveJobForSession(sessionId)
    return NextResponse.json({
      ok: true,
      sessionId,
      sku,
      email: customerEmailFromSession(session),
      job: job ? toPublicStatus(job) : null,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
