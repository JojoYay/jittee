import Stripe from 'stripe'

export const MINORWIRE_PRICE = {
  app: 'price_1UDd65JbDLMPi8UBlMFx7RSn',
  setup: 'price_1UDd66JbDLMPi8UBR20eZsSz',
} as const

export type MinorWireSku = 'minorwire_app' | 'minorwire_setup'

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key, { apiVersion: '2026-08-26.dahlia' })
}

export function skuFromPriceId(priceId: string | null | undefined): MinorWireSku | null {
  if (!priceId) return null
  if (priceId === MINORWIRE_PRICE.app) return 'minorwire_app'
  if (priceId === MINORWIRE_PRICE.setup) return 'minorwire_setup'
  return null
}

export function skuFromMetadata(meta: Stripe.Metadata | null | undefined): MinorWireSku | null {
  const sku = meta?.sku
  if (sku === 'minorwire_app' || sku === 'minorwire_setup') return sku
  return null
}

export async function resolveCheckoutSku(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<MinorWireSku | null> {
  const fromMeta = skuFromMetadata(session.metadata)
  if (fromMeta) return fromMeta

  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price'],
  })
  const priceId = full.line_items?.data?.[0]?.price
  const id = typeof priceId === 'string' ? priceId : priceId?.id
  return skuFromPriceId(id)
}

export function customerEmailFromSession(session: Stripe.Checkout.Session): string | null {
  return session.customer_details?.email ?? session.customer_email ?? null
}
