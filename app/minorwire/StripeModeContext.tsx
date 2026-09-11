'use client'

import { paymentLinksFor } from '@/lib/minorwire/stripeCatalog'

/** Public checkout is live-only. Query / localStorage cannot switch to test. */
export function useMinorWireStripeMode() {
  return {
    mode: 'live' as const,
    links: paymentLinksFor('live'),
    isTest: false,
  }
}
