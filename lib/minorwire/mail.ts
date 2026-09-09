import { Resend } from 'resend'
import type { MinorWireSku } from './stripe'

export async function sendMinorWireFulfillmentEmail(opts: {
  to: string
  sku: MinorWireSku
  downloadUrl: string
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MINORWIRE_MAIL_FROM || 'MinorWire <info@jittee.com>'
  if (!apiKey) {
    return { sent: false, reason: 'RESEND_API_KEY not set' }
  }

  const isSetup = opts.sku === 'minorwire_setup'
  const subject = isSetup
    ? 'MinorWire assisted setup — download + schedule'
    : 'MinorWire — your CLI download'

  const body = isSetup
    ? [
        'Thanks for purchasing MinorWire Assisted Setup (S$100).',
        '',
        '1) Download the CLI toolkit (link valid 7 days):',
        opts.downloadUrl,
        '',
        '2) Reply to this email (or write info@jittee.com) with a few time slots',
        '   so we can schedule the screen-share setup (~60 min, up to 2 devices).',
        '',
        'Quick start is inside the ZIP: docs/CUSTOMER_QUICKSTART.md',
      ].join('\n')
    : [
        'Thanks for purchasing MinorWire (S$10).',
        '',
        'Download the CLI toolkit (link valid 7 days):',
        opts.downloadUrl,
        '',
        'Quick start is inside the ZIP: docs/CUSTOMER_QUICKSTART.md',
        '',
        'Connect devices with the official WireGuard apps using the .conf files',
        'created by `npm run peer -- <name>`.',
      ].join('\n')

  const resend = new Resend(apiKey)
  const bccRaw = process.env.MINORWIRE_MAIL_BCC || 'info@jittee.com,mobilejoz@gmail.com'
  const bcc = bccRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  await resend.emails.send({
    from,
    to: opts.to,
    bcc,
    subject,
    text: body,
  })
  return { sent: true }
}
