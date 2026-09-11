import Stripe from 'stripe'
import {
  STRIPE_CATALOG,
  type StripeMode,
  defaultStripeModeFromEnv,
} from './stripeCatalog'

export type { StripeMode }
export { STRIPE_CATALOG, defaultStripeModeFromEnv, normalizeStripeMode, paymentLinksFor } from './stripeCatalog'

/** @deprecated Use STRIPE_CATALOG.live — kept for older imports */
export const MINORWIRE_PRICE = {
  app: STRIPE_CATALOG.live.app.priceId,
  setup: STRIPE_CATALOG.live.setup.priceId,
} as const

export type MinorWireSku = 'minorwire_app' | 'minorwire_setup'

const clients: Partial<Record<StripeMode, Stripe>> = {}

function cleanSecret(value: string | undefined): string | undefined {
  if (!value) return undefined
  // PowerShell Set-Content -Encoding utf8 often adds a UTF-8 BOM; strip it.
  return value.replace(/^\uFEFF/, '').trim() || undefined
}

function secretForMode(mode: StripeMode): string {
  if (mode === 'test') {
    const fromDedicated = cleanSecret(process.env.STRIPE_SECRET_KEY_TEST)
    const fromShared = cleanSecret(process.env.STRIPE_SECRET_KEY)
    const testKey =
      fromDedicated ||
      (fromShared?.startsWith('sk_test_') ||
      fromShared?.startsWith('rk_test_') ||
      fromShared?.startsWith('rkcs_test_')
        ? fromShared
        : undefined)
    if (!testKey) throw new Error('STRIPE_SECRET_KEY_TEST is not set')
    return testKey
  }

  const fromDedicated = cleanSecret(process.env.STRIPE_SECRET_KEY_LIVE)
  const fromShared = cleanSecret(process.env.STRIPE_SECRET_KEY)
  const liveKey =
    fromDedicated ||
    (fromShared?.startsWith('sk_live_') || fromShared?.startsWith('rk_live_')
      ? fromShared
      : undefined)
  if (!liveKey) throw new Error('STRIPE_SECRET_KEY_LIVE or STRIPE_SECRET_KEY (live) is not set')
  return liveKey
}

export function modeFromSessionId(sessionId: string | null | undefined): StripeMode | null {
  if (!sessionId) return null
  if (sessionId.startsWith('cs_test_')) return 'test'
  if (sessionId.startsWith('cs_live_')) return 'live'
  return null
}

export function getStripe(mode: StripeMode = defaultStripeModeFromEnv()): Stripe {
  const existing = clients[mode]
  if (existing) return existing
  const key = secretForMode(mode)
  const client = new Stripe(key, { apiVersion: '2026-08-26.dahlia' })
  clients[mode] = client
  return client
}

/** Pick live/test Stripe client from Checkout session id (cs_live_ / cs_test_). */
export function getStripeForSessionId(sessionId: string): Stripe {
  const mode = modeFromSessionId(sessionId) ?? defaultStripeModeFromEnv()
  return getStripe(mode)
}

export function webhookSecrets(): { mode: StripeMode; secret: string }[] {
  const out: { mode: StripeMode; secret: string }[] = []
  const live = cleanSecret(
    process.env.STRIPE_WEBHOOK_SECRET_LIVE || process.env.STRIPE_WEBHOOK_SECRET,
  )
  const test = cleanSecret(process.env.STRIPE_WEBHOOK_SECRET_TEST)
  if (live) out.push({ mode: 'live', secret: live })
  if (test) out.push({ mode: 'test', secret: test })
  return out
}

export function skuFromPriceId(priceId: string | null | undefined): MinorWireSku | null {
  if (!priceId) return null
  for (const mode of Object.keys(STRIPE_CATALOG) as StripeMode[]) {
    const c = STRIPE_CATALOG[mode]
    if (priceId === c.app.priceId) return 'minorwire_app'
    if (priceId === c.setup.priceId) return 'minorwire_setup'
  }
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
