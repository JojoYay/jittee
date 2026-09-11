export type StripeMode = 'live' | 'test'

export type StripeSkuCatalog = {
  app: { priceId: string; paymentLinkUrl: string }
  support: { priceId: string; paymentLinkUrl: string }
  /** Checkout with both app + support line items (still two Stripe products). */
  bundlePaymentLinkUrl: string
}

/** Legacy assisted-only price IDs (no longer sold). Kept so old sessions still resolve. */
export const LEGACY_SETUP_PRICE_IDS = [
  'price_1UEK94JbDLMPi8UB92lktUaD',
  'price_1UEK8gEMjpt2c9dsORhew64q',
  'price_1UDd66JbDLMPi8UBR20eZsSz',
  'price_1UDfnVEMjpt2c9dsHCYMTKJr',
] as const

/**
 * Public Stripe catalog — two products only:
 * - minorwire_app (S$18 DIY)
 * - minorwire_support (S$100 live help)
 * Bundle link sells both in one checkout (S$118 total).
 */
export const STRIPE_CATALOG: Record<StripeMode, StripeSkuCatalog> = {
  live: {
    app: {
      priceId: 'price_1UE5DUJbDLMPi8UBOyuCYCsZ',
      paymentLinkUrl: 'https://buy.stripe.com/3cIcN6cVO3ANeSLerbc3m08',
    },
    support: {
      priceId: 'price_1UEK96JbDLMPi8UBT0bByfd5',
      paymentLinkUrl: 'https://buy.stripe.com/28E5kEaNGdbndOHfvfc3m0a',
    },
    bundlePaymentLinkUrl: 'https://buy.stripe.com/5kQ28s6xq9ZbeSL5UFc3m0b',
  },
  test: {
    app: {
      priceId: 'price_1UE5CPEMjpt2c9dsyj5X2DIQ',
      paymentLinkUrl: 'https://buy.stripe.com/test_fZudR92swdTtdSxf2D4F202',
    },
    support: {
      priceId: 'price_1UEK8iEMjpt2c9dsIL7BbgvO',
      paymentLinkUrl: 'https://buy.stripe.com/test_4gMcN5ffi2aL15L6w74F204',
    },
    bundlePaymentLinkUrl: 'https://buy.stripe.com/test_dRmaEXaZ28z929P2fR4F205',
  },
}

export function normalizeStripeMode(value: string | null | undefined): StripeMode {
  return value?.trim().toLowerCase() === 'test' ? 'test' : 'live'
}

export function defaultStripeModeFromEnv(): StripeMode {
  return normalizeStripeMode(
    process.env.NEXT_PUBLIC_MINORWIRE_STRIPE_MODE || process.env.MINORWIRE_STRIPE_MODE,
  )
}

export function paymentLinksFor(mode: StripeMode) {
  const c = STRIPE_CATALOG[mode]
  return {
    app: c.app.paymentLinkUrl,
    support: c.support.paymentLinkUrl,
    /** DIY + support in one checkout (two products). */
    bundle: c.bundlePaymentLinkUrl,
  }
}
