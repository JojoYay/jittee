'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Syne, DM_Sans } from 'next/font/google'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

function ThanksInner() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const downloadHref = sessionId
    ? `/api/minorwire/download?session_id=${encodeURIComponent(sessionId)}`
    : null

  return (
    <div className={`${dmSans.className} min-h-[70vh] bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-2xl mx-auto px-4 py-24">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-4">
          MinorWire
        </p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-4`}>Payment received</h1>
        <p className="text-[#3a4f44] leading-relaxed mb-8">
          Download the CLI toolkit below. A copy of the download link is also emailed when mail
          delivery is configured. Assisted-setup buyers: email{' '}
          <a className="underline" href="mailto:info@jittee.com">
            info@jittee.com
          </a>{' '}
          to schedule the screen-share session.
        </p>

        {downloadHref ? (
          <a
            href={downloadHref}
            className="inline-flex px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
          >
            Download minorwire-cli.zip
          </a>
        ) : (
          <p className="text-red-700">
            Missing session id. Open the link from your Stripe receipt or contact info@jittee.com.
          </p>
        )}

        <p className="mt-10 text-sm text-[#5a6f64]">
          <Link href="/minorwire" className="underline">
            Back to MinorWire
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function MinorWireThanksPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <ThanksInner />
    </Suspense>
  )
}
