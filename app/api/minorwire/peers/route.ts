import { NextRequest, NextResponse } from 'next/server'
import { getStripeForSessionId, resolveCheckoutSku } from '@/lib/minorwire/stripe'
import {
  findCompletedJobForSession,
  getJob,
  toPublicStatus,
  updateJob,
} from '@/lib/minorwire/jobs/store'
import { decryptSecret } from '@/lib/minorwire/jobs/crypto'
import { addPeerAndFetchConfig } from '@/lib/minorwire/provision/ssh'

export const runtime = 'nodejs'
export const maxDuration = 120

/**
 * Add another WireGuard peer (.conf) for an already-provisioned server.
 * OCI infrastructure is not recreated — one server per purchase, many device configs.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { sessionId?: string; peerName?: string }
    const sessionId = body.sessionId?.trim()
    if (!sessionId?.startsWith('cs_')) {
      return NextResponse.json({ error: 'Valid Stripe session_id required' }, { status: 400 })
    }

    const peerName = (body.peerName || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32)
    if (!peerName) {
      return NextResponse.json({ error: 'peerName required' }, { status: 400 })
    }

    const stripe = getStripeForSessionId(sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 })
    }
    const sku = await resolveCheckoutSku(stripe, session)
    if (!sku) {
      return NextResponse.json({ error: 'Unknown purchase' }, { status: 403 })
    }

    const completed = await findCompletedJobForSession(sessionId)
    if (!completed?.publicIp || !completed.sshPrivateKeyEnc) {
      return NextResponse.json(
        { error: 'Provision a server first before adding device configs' },
        { status: 400 },
      )
    }

    const existingNames = new Set((completed.peers ?? []).map((p) => p.name))
    if (completed.peerName) existingNames.add(completed.peerName)
    if (existingNames.has(peerName)) {
      return NextResponse.json({ error: `Peer name already used: ${peerName}` }, { status: 409 })
    }

    const sshPem = decryptSecret(completed.sshPrivateKeyEnc)
    const peerConf = await addPeerAndFetchConfig({
      host: completed.publicIp,
      privateKeyPem: sshPem,
      peerName,
    })

    const peers = [
      ...(completed.peers ??
        (completed.peerConf && completed.peerName
          ? [{ name: completed.peerName, conf: completed.peerConf, createdAt: completed.createdAt }]
          : [])),
      { name: peerName, conf: peerConf, createdAt: Date.now() },
    ]

    await updateJob(completed.id, {
      peerName,
      peerConf,
      peers,
      message: `Added device config (${peerName}). Server unchanged.`,
    })

    const job = await getJob(completed.id)
    return NextResponse.json({ job: job ? toPublicStatus(job) : null, peerName, peerConf })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to add peer'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
