import Stripe from 'stripe'
import {
  LEGACY_SETUP_PRICE_IDS,
  STRIPE_CATALOG,
  type StripeMode,
  defaultStripeModeFromEnv,
} from './stripeCatalog'

export type { StripeMode }
export {
  STRIPE_CATALOG,
  LEGACY_SETUP_PRICE_IDS,
  defaultStripeModeFromEnv,
  normalizeStripeMode,
  paymentLinksFor,
} from './stripeCatalog'

/** @deprecated Use STRIPE_CATALOG.live — kept for older imports */
export const MINORWIRE_PRICE = {
  app: STRIPE_CATALOG.live.app.priceId,
  support: STRIPE_CATALOG.live.support.priceId,
} as const

export type MinorWireSku = 'minorwire_app' | 'minorwire_setup' | 'minorwire_support'

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
  if ((LEGACY_SETUP_PRICE_IDS as readonly string[]).includes(priceId)) return 'minorwire_setup'
  for (const mode of Object.keys(STRIPE_CATALOG) as StripeMode[]) {
    const c = STRIPE_CATALOG[mode]
    if (priceId === c.app.priceId) return 'minorwire_app'
    if (priceId === c.support.priceId) return 'minorwire_support'
  }
  return null
}

export function skuFromMetadata(meta: Stripe.Metadata | null | undefined): MinorWireSku | null {
  const sku = meta?.sku
  if (sku === 'minorwire_app' || sku === 'minorwire_setup' || sku === 'minorwire_support') return sku
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
  const items = full.line_items?.data ?? []
  // Prefer app when a bundle checkout includes both products.
  for (const item of items) {
    const priceId = typeof item.price === 'string' ? item.price : item.price?.id
    if (priceId && skuFromPriceId(priceId) === 'minorwire_app') return 'minorwire_app'
  }
  for (const item of items) {
    const priceId = typeof item.price === 'string' ? item.price : item.price?.id
    const sku = skuFromPriceId(priceId)
    if (sku) return sku
  }
  return null
}

export async function checkoutIncludesSupport(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  if (session.metadata?.bundle === 'app_support') return true
  if (skuFromMetadata(session.metadata) === 'minorwire_support') return true
  if (skuFromMetadata(session.metadata) === 'minorwire_setup') return true

  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price'],
  })
  for (const item of full.line_items?.data ?? []) {
    const priceId = typeof item.price === 'string' ? item.price : item.price?.id
    if (skuFromPriceId(priceId) === 'minorwire_support') return true
  }
  return false
}

export function customerEmailFromSession(session: Stripe.Checkout.Session): string | null {
  return session.customer_details?.email ?? session.customer_email ?? null
}

export function customerNameFromSession(session: Stripe.Checkout.Session): string | null {
  const name = session.customer_details?.name?.trim()
  return name || null
}

export function customerPhoneFromSession(session: Stripe.Checkout.Session): string | null {
  const phone = session.customer_details?.phone?.trim()
  return phone || null
}
