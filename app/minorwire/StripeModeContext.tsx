'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  defaultStripeModeFromEnv,
  normalizeStripeMode,
  paymentLinksFor,
  type StripeMode,
} from '@/lib/minorwire/stripeCatalog'

const STORAGE_KEY = 'minorwire_stripe_mode'

export function useMinorWireStripeMode() {
  const params = useSearchParams()
  const [mode, setModeState] = useState<StripeMode>(defaultStripeModeFromEnv)

  useEffect(() => {
    const fromQuery = params.get('stripe')
    if (fromQuery === 'test' || fromQuery === 'live') {
      setModeState(fromQuery)
      try {
        localStorage.setItem(STORAGE_KEY, fromQuery)
      } catch {
        /* ignore */
      }
      return
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'test' || stored === 'live') setModeState(stored)
    } catch {
      /* ignore */
    }
  }, [params])

  const setMode = useCallback((next: StripeMode) => {
    const m = normalizeStripeMode(next)
    setModeState(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      /* ignore */
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('stripe', m)
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  return {
    mode,
    setMode,
    links: paymentLinksFor(mode),
    isTest: mode === 'test',
  }
}
