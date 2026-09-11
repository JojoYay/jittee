export type StripeMode = 'live' | 'test'

export type StripeSkuCatalog = {
  app: { priceId: string; paymentLinkUrl: string }
  setup: { priceId: string; paymentLinkUrl: string }
}

/**
 * Public Stripe catalog (Payment Link URLs + Price IDs).
 * Live = JITTEE PayNow. Test = sandbox card checkout for dry runs.
 */
export const STRIPE_CATALOG: Record<StripeMode, StripeSkuCatalog> = {
  live: {
    app: {
      priceId: 'price_1UE5DUJbDLMPi8UBOyuCYCsZ',
      paymentLinkUrl: 'https://buy.stripe.com/3cIcN6cVO3ANeSLerbc3m08',
    },
    setup: {
      priceId: 'price_1UDd66JbDLMPi8UBR20eZsSz',
      paymentLinkUrl: 'https://buy.stripe.com/8x214ocVO5IVbGz1Epc3m07',
    },
  },
  test: {
    app: {
      priceId: 'price_1UE5CPEMjpt2c9dsyj5X2DIQ',
      paymentLinkUrl: 'https://buy.stripe.com/test_fZudR92swdTtdSxf2D4F202',
    },
    setup: {
      priceId: 'price_1UDfnVEMjpt2c9dsHCYMTKJr',
      paymentLinkUrl: 'https://buy.stripe.com/test_8x2cN50ko8z9eWBdYz4F201',
    },
  },
}

export function normalizeStripeMode(_value?: string | null): StripeMode {
  return 'live'
}

/** Public site is live-only; env overrides are ignored. */
export function defaultStripeModeFromEnv(): StripeMode {
  return 'live'
}

export function paymentLinksFor(_mode?: StripeMode) {
  const c = STRIPE_CATALOG.live
  return { app: c.app.paymentLinkUrl, setup: c.setup.paymentLinkUrl }
}
