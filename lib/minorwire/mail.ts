export type MinorWireSku = 'minorwire_app' | 'minorwire_setup'

const DEFAULT_ENDPOINT =
  'https://yyeleqhfbbjnscaddutx.supabase.co/functions/v1/minorwire-fulfillment'

/**
 * Send fulfillment mail via SpoSched Supabase Edge Function.
 * Shares RESEND_API_KEY (free tier); From uses MINORWIRE_RESEND_FROM when set.
 */
export async function sendMinorWireFulfillmentEmail(opts: {
  to: string
  sku: MinorWireSku
  setupUrl: string
}): Promise<{ sent: boolean; reason?: string }> {
  const secret = process.env.MINORWIRE_FULFILLMENT_SECRET
  if (!secret) {
    return { sent: false, reason: 'MINORWIRE_FULFILLMENT_SECRET not set' }
  }

  const endpoint = process.env.MINORWIRE_MAIL_ENDPOINT || DEFAULT_ENDPOINT
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-minorwire-secret': secret,
    },
    body: JSON.stringify({
      to: opts.to,
      sku: opts.sku,
      setupUrl: opts.setupUrl,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { sent: false, reason: `mail endpoint ${res.status}: ${text.slice(0, 200)}` }
  }
  return { sent: true }
}
