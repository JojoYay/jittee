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
      priceId: 'price_1UDd65JbDLMPi8UBlMFx7RSn',
      paymentLinkUrl: 'https://buy.stripe.com/aFaeVe4pifjvcKD1Epc3m06',
    },
    setup: {
      priceId: 'price_1UDd66JbDLMPi8UBR20eZsSz',
      paymentLinkUrl: 'https://buy.stripe.com/8x214ocVO5IVbGz1Epc3m07',
    },
  },
  test: {
    app: {
      priceId: 'price_1UDfnUEMjpt2c9dsNF1hnR8r',
      paymentLinkUrl: 'https://buy.stripe.com/test_8x2cN58QU16H15L4nZ4F200',
    },
    setup: {
      priceId: 'price_1UDfnVEMjpt2c9dsHCYMTKJr',
      paymentLinkUrl: 'https://buy.stripe.com/test_8x2cN50ko8z9eWBdYz4F201',
    },
  },
}

export function normalizeStripeMode(value: string | null | undefined): StripeMode {
  return value?.trim().toLowerCase() === 'test' ? 'test' : 'live'
}

/** Default mode from env (build/runtime). Query/UI may override on the client. */
export function defaultStripeModeFromEnv(): StripeMode {
  return normalizeStripeMode(
    process.env.NEXT_PUBLIC_MINORWIRE_STRIPE_MODE || process.env.MINORWIRE_STRIPE_MODE,
  )
}

export function paymentLinksFor(mode: StripeMode) {
  const c = STRIPE_CATALOG[mode]
  return { app: c.app.paymentLinkUrl, setup: c.setup.paymentLinkUrl }
}
