import { NextRequest, NextResponse } from 'next/server'
import {
  getStripeForSessionId,
  resolveCheckoutSku,
  customerEmailFromSession,
} from '@/lib/minorwire/stripe'
import { findActiveJobForSession, toPublicStatus } from '@/lib/minorwire/jobs/store'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')?.trim()
    if (!sessionId?.startsWith('cs_')) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
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
    let job = null
    try {
      const found = await findActiveJobForSession(sessionId)
      job = found ? toPublicStatus(found) : null
    } catch (jobErr) {
      console.error('[minorwire/session] job lookup failed', jobErr)
      // Payment is verified; allow wizard even if Firestore is temporarily unavailable.
    }
    return NextResponse.json({
      ok: true,
      sessionId,
      sku,
      email: customerEmailFromSession(session),
      job,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
