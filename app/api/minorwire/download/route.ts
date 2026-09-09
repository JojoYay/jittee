import { NextRequest, NextResponse } from 'next/server'
import { getStripeForSessionId, resolveCheckoutSku } from '@/lib/minorwire/stripe'
import { verifyDownloadToken } from '@/lib/minorwire/downloadToken'
import { readMinorWireZip } from '@/lib/minorwire/zip'

export const runtime = 'nodejs'

async function assertPaidSession(sessionId: string): Promise<boolean> {
  const stripe = getStripeForSessionId(sessionId)
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return false
  }
  const sku = await resolveCheckoutSku(stripe, session)
  return Boolean(sku)
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    const sessionIdParam = req.nextUrl.searchParams.get('session_id')

    let sessionId: string | null = null
    if (token) {
      const verified = verifyDownloadToken(token)
      sessionId = verified?.sessionId ?? null
    } else if (sessionIdParam) {
      sessionId = sessionIdParam
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing token or session_id' }, { status: 400 })
    }

    const ok = await assertPaidSession(sessionId)
    if (!ok) {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 403 })
    }

    const zip = readMinorWireZip()
    return new NextResponse(new Uint8Array(zip), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="minorwire-cli.zip"',
        'Content-Length': String(zip.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Download failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
