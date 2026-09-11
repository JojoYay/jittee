export type StripeMode = 'live' | 'test'

export type StripeSkuCatalog = {
  app: { priceId: string; paymentLinkUrl: string }
  setup: { priceId: string; paymentLinkUrl: string }
  support: { priceId: string; paymentLinkUrl: string }
}

/**
 * Public Stripe catalog (Payment Link URLs + Price IDs).
 * Live = JITTEE PayNow. Test = sandbox card checkout for dry runs.
 * setup = full assisted (S$118). support = add-on after DIY (S$100).
 */
export const STRIPE_CATALOG: Record<StripeMode, StripeSkuCatalog> = {
  live: {
    app: {
      priceId: 'price_1UE5DUJbDLMPi8UBOyuCYCsZ',
      paymentLinkUrl: 'https://buy.stripe.com/3cIcN6cVO3ANeSLerbc3m08',
    },
    setup: {
      priceId: 'price_1UEK94JbDLMPi8UB92lktUaD',
      paymentLinkUrl: 'https://buy.stripe.com/fZu9AUdZS9ZbfWPfvfc3m09',
    },
    support: {
      priceId: 'price_1UEK96JbDLMPi8UBT0bByfd5',
      paymentLinkUrl: 'https://buy.stripe.com/28E5kEaNGdbndOHfvfc3m0a',
    },
  },
  test: {
    app: {
      priceId: 'price_1UE5CPEMjpt2c9dsyj5X2DIQ',
      paymentLinkUrl: 'https://buy.stripe.com/test_fZudR92swdTtdSxf2D4F202',
    },
    setup: {
      priceId: 'price_1UEK8gEMjpt2c9dsORhew64q',
      paymentLinkUrl: 'https://buy.stripe.com/test_00w4gz8QU02D9Ch5s34F203',
    },
    support: {
      priceId: 'price_1UEK8iEMjpt2c9dsIL7BbgvO',
      paymentLinkUrl: 'https://buy.stripe.com/test_4gMcN5ffi2aL15L6w74F204',
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
  return {
    app: c.app.paymentLinkUrl,
    setup: c.setup.paymentLinkUrl,
    support: c.support.paymentLinkUrl,
  }
}
