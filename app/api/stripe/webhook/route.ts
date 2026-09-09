import { NextRequest, NextResponse } from 'next/server'
import {
  customerEmailFromSession,
  getStripe,
  resolveCheckoutSku,
} from '@/lib/minorwire/stripe'
import { createDownloadToken } from '@/lib/minorwire/downloadToken'
import { sendMinorWireFulfillmentEmail } from '@/lib/minorwire/mail'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not set' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json({ ok: true, skipped: 'not_paid' })
    }

    const sku = await resolveCheckoutSku(stripe, session)
    if (!sku) {
      return NextResponse.json({ ok: true, skipped: 'unknown_sku' })
    }

    const email = customerEmailFromSession(session)
    if (!email) {
      return NextResponse.json({ ok: true, skipped: 'no_email' })
    }

    const token = createDownloadToken(session.id)
    const base = process.env.MINORWIRE_PUBLIC_BASE_URL || 'https://jittee.com'
    const downloadUrl = `${base}/api/minorwire/download?token=${encodeURIComponent(token)}`

    const mail = await sendMinorWireFulfillmentEmail({ to: email, sku, downloadUrl })
    return NextResponse.json({ ok: true, sku, emailed: mail.sent, reason: mail.reason })
  }

  return NextResponse.json({ ok: true, ignored: event.type })
}
