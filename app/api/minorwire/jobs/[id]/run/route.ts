import { NextRequest, NextResponse } from 'next/server'
import type { OciCredentials } from '@/lib/minorwire/provision/types'
import { getJob, updateJob } from '@/lib/minorwire/jobs/store'
import { runProvisionJob } from '@/lib/minorwire/jobs/runProvisionJob'

export const runtime = 'nodejs'
export const maxDuration = 3600

function internalSecret(): string {
  return (
    process.env.MINORWIRE_JOB_RUN_SECRET ||
    process.env.MINORWIRE_FULFILLMENT_SECRET ||
    process.env.MINORWIRE_DOWNLOAD_SECRET ||
    ''
  )
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const expected = internalSecret()
  const provided = req.headers.get('x-minorwire-job-secret') ?? ''
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  const job = await getJob(id)
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }
  if (job.phase !== 'queued') {
    return NextResponse.json({ ok: true, skipped: 'not_queued' })
  }

  const body = (await req.json()) as { creds?: OciCredentials; peerName?: string }
  if (!body.creds) {
    await updateJob(id, { phase: 'error', message: 'Failed', error: 'Missing credentials payload' })
    return NextResponse.json({ error: 'missing creds' }, { status: 400 })
  }

  // Long-running; Cloud Run timeout is 3600s via apphosting.yaml / maxDuration.
  await runProvisionJob({
    jobId: id,
    creds: body.creds,
    peerName: body.peerName || 'device1',
  })

  return NextResponse.json({ ok: true })
}
