'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { buildIamPolicy } from '@/lib/minorwire/iamPolicy'
import type { JobPublicStatus } from '@/lib/minorwire/provision/types'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type FormState = {
  region: string
  tenancyOcid: string
  compartmentOcid: string
  userOcid: string
  fingerprint: string
  privateKeyPem: string
  peerName: string
  compartmentName: string
}

const emptyForm: FormState = {
  region: 'ap-tokyo-1',
  tenancyOcid: '',
  compartmentOcid: '',
  userOcid: '',
  fingerprint: '',
  privateKeyPem: '',
  peerName: 'device1',
  compartmentName: 'TARGET_COMPARTMENT',
}

function SetupInner() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')?.trim() ?? ''
  const [gate, setGate] = useState<'loading' | 'ok' | 'bad'>('loading')
  const [gateError, setGateError] = useState('')
  const [sku, setSku] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [job, setJob] = useState<JobPublicStatus | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setGate('bad')
      setGateError('Missing session_id. Complete PayNow checkout first.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/minorwire/session?session_id=${encodeURIComponent(sessionId)}`)
        const data = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setGate('bad')
          setGateError(data.error || 'Payment not verified')
          return
        }
        setSku(data.sku || '')
        if (data.job) setJob(data.job)
        setGate('ok')
      } catch {
        if (!cancelled) {
          setGate('bad')
          setGateError('Could not verify payment')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  useEffect(() => {
    if (!job || !sessionId) return
    if (job.phase === 'done' || job.phase === 'error') return
    const t = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/minorwire/jobs/${encodeURIComponent(job.id)}?session_id=${encodeURIComponent(sessionId)}`,
        )
        const data = await res.json()
        if (res.ok && data.job) setJob(data.job)
      } catch {
        /* ignore poll errors */
      }
    }, 4000)
    return () => clearInterval(t)
  }, [job, sessionId])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!sessionId || submitting) return
      setSubmitting(true)
      setSubmitError('')
      try {
        const res = await fetch('/api/minorwire/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            peerName: form.peerName,
            region: form.region,
            tenancyOcid: form.tenancyOcid,
            compartmentOcid: form.compartmentOcid,
            userOcid: form.userOcid,
            fingerprint: form.fingerprint,
            privateKeyPem: form.privateKeyPem,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setSubmitError(data.error || 'Failed to start')
          return
        }
        setJob(data.job)
      } catch {
        setSubmitError('Network error')
      } finally {
        setSubmitting(false)
      }
    },
    [sessionId, submitting, form],
  )

  const set =
    (key: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: ev.target.value }))

  const policy = buildIamPolicy(form.compartmentName)
  const running = job && job.phase !== 'done' && job.phase !== 'error'
  const showForm = gate === 'ok' && (!job || job.phase === 'error')

  return (
    <div className={`${dmSans.className} min-h-screen bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-3">
          MinorWire setup
        </p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-2`}>Provision in your OCI</h1>
        <p className="text-[#3a4f44] mb-8 leading-relaxed">
          Paste a least-privilege API key. We create Always Free WireGuard on your tenancy and hand
          you a config for the official WireGuard app. Keys are not stored after the job finishes.
        </p>

        {gate === 'loading' && <p>Verifying payment…</p>}
        {gate === 'bad' && (
          <div className="border border-red-300 bg-red-50 p-4 rounded-md">
            <p className="font-semibold text-red-800">Cannot start setup</p>
            <p className="text-red-700 mt-1">{gateError}</p>
            <Link href="/minorwire" className="underline mt-3 inline-block">
              Back to MinorWire
            </Link>
          </div>
        )}

        {gate === 'ok' && (
          <>
            <p className="text-sm text-[#5a6f64] mb-6">
              Purchase: <span className="font-mono">{sku}</span>
            </p>

            {job && (
              <div className="mb-8 border border-[#1d3d2e]/15 bg-white p-5 rounded-md">
                <p className={`${syne.className} font-bold text-lg`}>Status: {job.phase}</p>
                <p className="text-[#3a4f44] mt-1">{job.message}</p>
                {job.publicIp && (
                  <p className="mt-2 text-sm font-mono text-[#2f6b4f]">Public IP: {job.publicIp}</p>
                )}
                {job.error && <p className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{job.error}</p>}
                {running && <p className="mt-3 text-sm text-[#5a6f64]">Working… this can take several minutes.</p>}
                {job.phase === 'done' && job.peerConf && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">
                      WireGuard config ({job.peerName || 'device'}) — import into the official app
                    </p>
                    <textarea
                      readOnly
                      className="w-full h-48 font-mono text-xs p-3 border border-[#1d3d2e]/20 rounded bg-[#f7faf8]"
                      value={job.peerConf}
                    />
                    <a
                      className="mt-3 inline-flex px-4 py-2 bg-[#1d3d2e] text-white rounded-md font-semibold"
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(job.peerConf)}`}
                      download={`${job.peerName || 'device'}.conf`}
                    >
                      Download .conf
                    </a>
                  </div>
                )}
              </div>
            )}

            {showForm && (
              <form onSubmit={onSubmit} className="space-y-5 border border-[#1d3d2e]/15 bg-white/80 p-6 rounded-md">
                <div>
                  <label className="block text-sm font-medium mb-1">IAM policy (copy into OCI)</label>
                  <input
                    className="w-full border px-3 py-2 rounded mb-2"
                    value={form.compartmentName}
                    onChange={set('compartmentName')}
                    placeholder="Compartment name used in policy"
                  />
                  <textarea
                    readOnly
                    className="w-full h-36 font-mono text-xs p-3 border rounded bg-[#f7faf8]"
                    value={policy}
                  />
                </div>
                {(
                  [
                    ['region', 'Region', 'ap-tokyo-1'],
                    ['tenancyOcid', 'Tenancy OCID', 'ocid1.tenancy.oc1..'],
                    ['compartmentOcid', 'Compartment OCID', 'ocid1.compartment.oc1..'],
                    ['userOcid', 'User OCID', 'ocid1.user.oc1..'],
                    ['fingerprint', 'API key fingerprint', 'aa:bb:...'],
                    ['peerName', 'Device name for first config', 'device1'],
                  ] as const
                ).map(([key, label, ph]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      required={key !== 'peerName'}
                      className="w-full border px-3 py-2 rounded"
                      value={form[key]}
                      onChange={set(key)}
                      placeholder={ph}
                      autoComplete="off"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">API private key (PEM)</label>
                  <textarea
                    required
                    className="w-full h-40 font-mono text-xs p-3 border rounded"
                    value={form.privateKeyPem}
                    onChange={set('privateKeyPem')}
                    placeholder="-----BEGIN PRIVATE KEY-----"
                    autoComplete="off"
                  />
                </div>
                {submitError && <p className="text-red-700 text-sm">{submitError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-md bg-[#1d3d2e] text-white font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Starting…' : 'Create VPN'}
                </button>
              </form>
            )}
          </>
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

export default function MinorWireSetupPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <SetupInner />
    </Suspense>
  )
}
