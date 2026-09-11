'use client'

import { paymentLinksFor, type StripeMode } from '@/lib/minorwire/stripeCatalog'

/**
 * Test-mode UI / checkout is closed for customers.
 * Backend still resolves cs_test_ sessions for legacy webhooks.
 */
export function useMinorWireStripeMode() {
  const mode: StripeMode = 'live'

  return {
    mode,
    setMode: (_next: StripeMode) => {
      /* test purchase path disabled — live only */
    },
    links: paymentLinksFor('live'),
    isTest: false as const,
  }
}
