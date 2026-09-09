'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { buildIamPolicy } from '@/lib/minorwire/iamPolicy'
import type { JobPublicStatus } from '@/lib/minorwire/provision/types'
import { useLanguage } from '../../contexts/LanguageContext'
import { SETUP_COPY } from './copy'
import { OCI_LINKS, OCI_REGION } from './ociLinks'

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
  policyCompartmentName: string
}

const emptyForm: FormState = {
  region: OCI_REGION,
  tenancyOcid: '',
  compartmentOcid: '',
  userOcid: '',
  fingerprint: '',
  privateKeyPem: '',
  peerName: 'device1',
  policyCompartmentName: '',
}

function SetupInner() {
  const { locale } = useLanguage()
  const c = SETUP_COPY[locale] ?? SETUP_COPY.ja
  const params = useSearchParams()
  const sessionId = params.get('session_id')?.trim() ?? ''
  const [gate, setGate] = useState<'loading' | 'ok' | 'bad'>('loading')
  const [gateError, setGateError] = useState('')
  const [sku, setSku] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [job, setJob] = useState<JobPublicStatus | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [extraPeerName, setExtraPeerName] = useState('device2')
  const [peerBusy, setPeerBusy] = useState(false)
  const [peerError, setPeerError] = useState('')
  const [copiedPolicy, setCopiedPolicy] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setGate('bad')
      setGateError(c.missingSession)
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
          setGateError(data.error || c.paymentUnverified)
          return
        }
        setSku(data.sku || '')
        if (data.job) setJob(data.job)
        setGate('ok')
      } catch {
        if (!cancelled) {
          setGate('bad')
          setGateError(c.verifyFailed)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId, c.missingSession, c.paymentUnverified, c.verifyFailed])

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
          setSubmitError(data.error || c.failedStart)
          return
        }
        setJob(data.job)
      } catch {
        setSubmitError(c.networkError)
      } finally {
        setSubmitting(false)
      }
    },
    [sessionId, submitting, form, c.failedStart, c.networkError],
  )

  const onAddPeer = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!sessionId || peerBusy) return
      setPeerBusy(true)
      setPeerError('')
      try {
        const res = await fetch('/api/minorwire/peers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, peerName: extraPeerName }),
        })
        const data = await res.json()
        if (!res.ok) {
          setPeerError(data.error || c.failedPeer)
          return
        }
        if (data.job) setJob(data.job)
        setExtraPeerName((n) => {
          const m = /^(.+?)(\d+)$/.exec(n)
          if (m) return `${m[1]}${Number(m[2]) + 1}`
          return `${n}2`
        })
      } catch {
        setPeerError(c.networkError)
      } finally {
        setPeerBusy(false)
      }
    },
    [sessionId, peerBusy, extraPeerName, c.failedPeer, c.networkError],
  )

  const set =
    (key: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: ev.target.value }))

  const policyName = form.policyCompartmentName.trim() || 'REPLACE_WITH_COMPARTMENT_NAME'
  const policy = buildIamPolicy(policyName)
  const running = job && job.phase !== 'done' && job.phase !== 'error'
  const showForm = gate === 'ok' && (!job || job.phase === 'error')

  const copyPolicy = async () => {
    try {
      await navigator.clipboard.writeText(policy)
      setCopiedPolicy(true)
      setTimeout(() => setCopiedPolicy(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`${dmSans.className} min-h-screen bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-3">
          {c.badge}
        </p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-2`}>{c.title}</h1>
        <p className="text-[#3a4f44] mb-8 leading-relaxed">{c.intro}</p>

        {gate === 'loading' && <p>{c.verifying}</p>}
        {gate === 'bad' && (
          <div className="border border-red-300 bg-red-50 p-4 rounded-md">
            <p className="font-semibold text-red-800">{c.cannotStart}</p>
            <p className="text-red-700 mt-1">{gateError}</p>
            <Link href="/minorwire" className="underline mt-3 inline-block">
              {c.back}
            </Link>
          </div>
        )}

        {gate === 'ok' && (
          <>
            <p className="text-sm text-[#5a6f64] mb-6">
              {c.purchase}: <span className="font-mono">{sku}</span>
            </p>

            {job && (
              <div className="mb-8 border border-[#1d3d2e]/15 bg-white p-5 rounded-md">
                <p className={`${syne.className} font-bold text-lg`}>
                  {c.status}: {job.phase}
                </p>
                <p className="text-[#3a4f44] mt-1">{job.message}</p>
                {job.publicIp && (
                  <p className="mt-2 text-sm font-mono text-[#2f6b4f]">
                    {c.publicIp}: {job.publicIp}
                  </p>
                )}
                {job.error && <p className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{job.error}</p>}
                {running && <p className="mt-3 text-sm text-[#5a6f64]">{c.working}</p>}
                {job.phase === 'done' && (
                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-[#5a6f64]">{c.doneNote}</p>
                    {(job.peers?.length
                      ? job.peers
                      : job.peerConf
                        ? [{ name: job.peerName || 'device', conf: job.peerConf, createdAt: job.createdAt }]
                        : []
                    ).map((p) => (
                      <div key={p.name}>
                        <p className="font-semibold mb-2">{c.confTitle(p.name)}</p>
                        <textarea
                          readOnly
                          className="w-full h-36 font-mono text-xs p-3 border border-[#1d3d2e]/20 rounded bg-[#f7faf8]"
                          value={p.conf}
                        />
                        <a
                          className="mt-2 inline-flex px-4 py-2 bg-[#1d3d2e] text-white rounded-md font-semibold text-sm"
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(p.conf)}`}
                          download={`${p.name}.conf`}
                        >
                          {c.downloadConf(p.name)}
                        </a>
                      </div>
                    ))}
                    <form onSubmit={onAddPeer} className="border-t border-[#1d3d2e]/10 pt-4 space-y-3">
                      <p className="font-semibold">{c.addPeerTitle}</p>
                      <input
                        className="w-full border px-3 py-2 rounded"
                        value={extraPeerName}
                        onChange={(e) => setExtraPeerName(e.target.value)}
                        placeholder={c.addPeerPlaceholder}
                        required
                      />
                      {peerError && <p className="text-sm text-red-700">{peerError}</p>}
                      <button
                        type="submit"
                        disabled={peerBusy}
                        className="px-5 py-2.5 rounded-md border border-[#1d3d2e] font-semibold disabled:opacity-60"
                      >
                        {peerBusy ? c.addPeerBusy : c.addPeerSubmit}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {showForm && (
              <div className="space-y-8">
                <section className="border border-amber-700/30 bg-amber-50 p-5 rounded-md space-y-3">
                  <h2 className={`${syne.className} text-xl font-bold`}>{c.targetTitle}</h2>
                  <p className="text-[#3a4f44] leading-relaxed">{c.targetBody}</p>
                </section>

                <section className="border border-[#1d3d2e]/15 bg-white p-5 rounded-md space-y-3">
                  <h2 className={`${syne.className} text-2xl font-bold`}>{c.urlsTitle}</h2>
                  <p className="text-sm text-[#3a4f44]">{c.urlsIntro}</p>
                  <ul className="space-y-2 text-sm text-[#3a4f44]">
                    <li>
                      <a className="underline font-semibold" href={OCI_LINKS.home} target="_blank" rel="noreferrer">
                        {c.urlHome}
                      </a>{' '}
                      — {c.urlHomeHint}
                    </li>
                    <li>
                      <a className="underline font-semibold" href={OCI_LINKS.tenancy} target="_blank" rel="noreferrer">
                        {c.urlTenancy}
                      </a>{' '}
                      — {c.urlTenancyHint}
                    </li>
                    <li>
                      <a
                        className="underline font-semibold"
                        href={OCI_LINKS.compartments}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.urlCompartments}
                      </a>{' '}
                      — {c.urlCompartmentsHint}
                    </li>
                    <li>
                      <a className="underline font-semibold" href={OCI_LINKS.domains} target="_blank" rel="noreferrer">
                        {c.urlDomains}
                      </a>{' '}
                      — {c.urlDomainsHint}
                    </li>
                    <li>
                      <a
                        className="underline font-semibold"
                        href={OCI_LINKS.myProfile}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.urlProfile}
                      </a>{' '}
                      — {c.urlProfileHint}
                    </li>
                    <li>
                      <a
                        className="underline font-semibold"
                        href={OCI_LINKS.policies}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.urlPolicies}
                      </a>{' '}
                      — {c.urlPoliciesHint}
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className={`${syne.className} text-2xl font-bold`}>{c.prepareTitle}</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-[#3a4f44]">
                    {c.prepareSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p className="text-sm text-[#5a6f64]">
                    <a className="underline font-semibold" href={OCI_LINKS.home} target="_blank" rel="noreferrer">
                      {OCI_LINKS.home}
                    </a>
                  </p>

                  <div className="grid gap-4">
                    <figure className="border border-[#1d3d2e]/10 bg-white rounded-md overflow-hidden">
                      <Image
                        src="/minorwire/guide/tenancy-ocid.png"
                        alt="Tenancy OCID"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <figcaption className="p-3 text-sm text-[#5a6f64]">{c.figTenancy}</figcaption>
                    </figure>
                    <figure className="border border-[#1d3d2e]/10 bg-white rounded-md overflow-hidden">
                      <Image
                        src="/minorwire/guide/compartment.png"
                        alt="Compartment"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <figcaption className="p-3 text-sm text-[#5a6f64]">{c.figCompartment}</figcaption>
                    </figure>
                    <figure className="border border-[#1d3d2e]/10 bg-white rounded-md overflow-hidden">
                      <Image
                        src="/minorwire/guide/api-keys.png"
                        alt="API keys"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                      />
                      <figcaption className="p-3 text-sm text-[#5a6f64]">{c.figApiKeys}</figcaption>
                    </figure>
                  </div>
                </section>

                <section className="border border-[#1d3d2e]/15 bg-white/80 p-6 rounded-md space-y-3">
                  <h2 className={`${syne.className} text-2xl font-bold`}>{c.policyTitle}</h2>
                  <p className="text-sm text-[#3a4f44]">
                    {c.policyIntroBefore}
                    <a
                      className="underline font-semibold"
                      href={OCI_LINKS.policies}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.urlPolicies}
                    </a>
                    {c.policyIntroAfter}
                  </p>
                  <label className="block text-sm font-medium">{c.policyNameLabel}</label>
                  <input
                    className="w-full border px-3 py-2 rounded"
                    value={form.policyCompartmentName}
                    onChange={set('policyCompartmentName')}
                    placeholder={c.policyNamePlaceholder}
                    autoComplete="off"
                  />
                  <textarea
                    readOnly
                    className="w-full h-40 font-mono text-xs p-3 border rounded bg-[#f7faf8]"
                    value={policy}
                  />
                  <button
                    type="button"
                    onClick={copyPolicy}
                    className="px-4 py-2 rounded-md border border-[#1d3d2e] font-semibold text-sm"
                  >
                    {copiedPolicy ? c.copiedPolicy : c.copyPolicy}
                  </button>
                </section>

                <form
                  onSubmit={onSubmit}
                  className="space-y-5 border border-[#1d3d2e]/15 bg-white/80 p-6 rounded-md"
                >
                  <h2 className={`${syne.className} text-2xl font-bold`}>{c.formTitle}</h2>
                  <p className="text-sm text-[#5a6f64]">{c.formIntro}</p>

                  {c.fields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium mb-1">{f.label}</label>
                      <p className="text-xs text-[#5a6f64] mb-1 leading-relaxed">{f.where}</p>
                      {f.url && (
                        <p className="text-xs mb-2">
                          <a
                            className="underline font-semibold text-[#2f6b4f]"
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {f.urlLabel}
                          </a>
                        </p>
                      )}
                      <input
                        required={f.required !== false}
                        className="w-full border px-3 py-2 rounded font-mono text-sm"
                        value={form[f.key]}
                        onChange={set(f.key)}
                        placeholder={f.placeholder}
                        autoComplete="off"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium mb-1">{c.pemLabel}</label>
                    <p className="text-xs text-[#5a6f64] mb-1 leading-relaxed">{c.pemWhere}</p>
                    <p className="text-xs mb-2">
                      <a
                        className="underline font-semibold text-[#2f6b4f]"
                        href={OCI_LINKS.myProfile}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.pemUrlLabel}
                      </a>
                    </p>
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
                    {submitting ? c.submitBusy : c.submit}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-sm text-[#5a6f64]">
          <Link href="/minorwire" className="underline">
            {c.back}
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
