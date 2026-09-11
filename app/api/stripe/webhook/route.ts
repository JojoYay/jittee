import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  customerEmailFromSession,
  getStripe,
  resolveCheckoutSku,
  webhookSecrets,
  type StripeMode,
} from '@/lib/minorwire/stripe'
import { sendMinorWireFulfillmentEmail } from '@/lib/minorwire/mail'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const secrets = webhookSecrets()
  if (secrets.length === 0) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET or STRIPE_WEBHOOK_SECRET_TEST not set' },
      { status: 500 },
    )
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event | null = null
  let mode: StripeMode | null = null
  const errors: string[] = []

  for (const entry of secrets) {
    try {
      // Verify with webhook secret only — do not require Stripe API keys first.
      event = Stripe.webhooks.constructEvent(body, signature, entry.secret)
      mode = entry.mode
      break
    } catch (err) {
      errors.push(`${entry.mode}: ${err instanceof Error ? err.message : 'invalid'}`)
    }
  }

  if (!event || !mode) {
    console.error('[stripe/webhook] invalid signature', {
      tried: errors,
      liveSecretLen: (process.env.STRIPE_WEBHOOK_SECRET || '').replace(/^\uFEFF/, '').trim().length,
      testSecretLen: (process.env.STRIPE_WEBHOOK_SECRET_TEST || '').replace(/^\uFEFF/, '').trim().length,
      bodyLen: body.length,
    })
    return NextResponse.json(
      { error: 'Invalid signature', tried: errors },
      { status: 400 },
    )
  }

  const stripe = getStripe(mode)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json({ ok: true, skipped: 'not_paid', mode })
    }

    const sku = await resolveCheckoutSku(stripe, session)
    if (!sku) {
      return NextResponse.json({ ok: true, skipped: 'unknown_sku', mode })
    }

    const email = customerEmailFromSession(session)
    if (!email) {
      return NextResponse.json({ ok: true, skipped: 'no_email', mode })
    }

    const base = process.env.MINORWIRE_PUBLIC_BASE_URL || 'https://jittee.com'
    const setupUrl = `${base}/minorwire/setup?session_id=${encodeURIComponent(session.id)}`

    const mail = await sendMinorWireFulfillmentEmail({ to: email, sku, setupUrl })
    console.log('[stripe/webhook] fulfillment', { sku, mode, emailed: mail.sent, reason: mail.reason })
    return NextResponse.json({ ok: true, sku, mode, emailed: mail.sent, reason: mail.reason })
  }

  return NextResponse.json({ ok: true, ignored: event.type, mode })
}
