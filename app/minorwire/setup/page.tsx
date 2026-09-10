'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import type { JobPublicStatus } from '@/lib/minorwire/provision/types'
import { useLanguage } from '../../contexts/LanguageContext'
import { SETUP_COPY } from './copy'
import { buildOciLinks } from './ociLinks'
import { defaultRegionForLocale, REGION_OPTIONS } from './regions'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type FormState = {
  region: string
  tenancyOcid: string
  userOcid: string
  fingerprint: string
  privateKeyPem: string
  peerName: string
}

function emptyFormForLocale(locale: string): FormState {
  return {
    region: defaultRegionForLocale(locale),
    tenancyOcid: '',
    userOcid: '',
    fingerprint: '',
    privateKeyPem: '',
    peerName: 'device1',
  }
}

function SetupInner() {
  const { locale } = useLanguage()
  const c = SETUP_COPY[locale] ?? SETUP_COPY.ja
  const params = useSearchParams()
  const sessionId = params.get('session_id')?.trim() ?? ''
  const [gate, setGate] = useState<'loading' | 'ok' | 'bad'>('loading')
  const [gateError, setGateError] = useState('')
  const [sku, setSku] = useState('')
  const [form, setForm] = useState<FormState>(() => emptyFormForLocale(locale))
  const [job, setJob] = useState<JobPublicStatus | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [extraPeerName, setExtraPeerName] = useState('device2')
  const [peerBusy, setPeerBusy] = useState(false)
  const [peerError, setPeerError] = useState('')
  const ociLinks = buildOciLinks(form.region)

  useEffect(() => {
    setForm((f) => ({ ...f, region: defaultRegionForLocale(locale) }))
  }, [locale])

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
      const tenancy = form.tenancyOcid.trim()
      try {
        const res = await fetch('/api/minorwire/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            peerName: form.peerName,
            region: form.region,
            tenancyOcid: tenancy,
            // Admin simple path: root compartment == tenancy OCID
            compartmentOcid: tenancy,
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

  const running = job && job.phase !== 'done' && job.phase !== 'error'
  const showForm = gate === 'ok' && (!job || job.phase === 'error')

  return (
    <div className={`${dmSans.className} min-h-screen bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-3">
          {c.badge}
        </p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-2`}>{c.title}</h1>
        <p className="text-[#3a4f44] mb-8 leading-relaxed">{c.intro}</p>

        {gate !== 'loading' && (
          <div className="mb-8 space-y-4">
            <section className="border border-[#1d3d2e]/15 bg-white p-5 rounded-md">
              <h2 className={`${syne.className} text-xl font-bold mb-3`}>{c.needsTitle}</h2>
              <ul className="space-y-2 text-[#3a4f44]">
                {c.needsItems.map((item) => (
                  <li key={item} className="border-l-2 border-[#7dba98] pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="border border-[#1d3d2e]/15 bg-white p-5 rounded-md">
              <h2 className={`${syne.className} text-xl font-bold mb-3`}>{c.flowTitle}</h2>
              <ol className="list-decimal pl-5 space-y-2 text-[#3a4f44]">
                {c.flowSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </div>
        )}

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
                <section className="space-y-5">
                  <div>
                    <h2 className={`${syne.className} text-2xl font-bold`}>{c.guideTitle}</h2>
                    <p className="text-sm text-[#3a4f44] mt-2 leading-relaxed">{c.guideIntro}</p>
                  </div>
                  {c.guideSteps.map((step) => {
                    const stepHref = step.ociLink ? ociLinks[step.ociLink] : step.link
                    return (
                      <article
                        key={step.title}
                        className="border border-[#1d3d2e]/15 bg-white rounded-md overflow-hidden"
                      >
                        <div className="p-5 space-y-2">
                          <h3 className={`${syne.className} text-lg font-bold`}>{step.title}</h3>
                          <p className="text-sm text-[#3a4f44] leading-relaxed">{step.body}</p>
                          {stepHref && (
                            <p className="text-sm">
                              <a
                                className="underline font-semibold text-[#2f6b4f]"
                                href={stepHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {step.linkLabel || stepHref}
                              </a>
                            </p>
                          )}
                        </div>
                        <figure>
                          <Image
                            src={step.image}
                            alt={step.imageAlt}
                            width={1280}
                            height={720}
                            className="w-full h-auto border-t border-[#1d3d2e]/10"
                          />
                        </figure>
                      </article>
                    )
                  })}
                </section>

                <form
                  onSubmit={onSubmit}
                  className="space-y-5 border border-[#1d3d2e]/15 bg-white/80 p-6 rounded-md"
                >
                  <h2 className={`${syne.className} text-2xl font-bold`}>{c.formTitle}</h2>
                  <p className="text-sm text-[#5a6f64]">{c.formIntro}</p>

                  {c.fields.map((f) => {
                    const fieldHref = f.ociLink ? ociLinks[f.ociLink] : undefined
                    return (
                      <div key={f.key}>
                        <label className="block text-sm font-medium mb-1">{f.label}</label>
                        <p className="text-xs text-[#5a6f64] mb-1 leading-relaxed">{f.where}</p>
                        {fieldHref && (
                          <p className="text-xs mb-2">
                            <a
                              className="underline font-semibold text-[#2f6b4f]"
                              href={fieldHref}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {f.urlLabel}
                            </a>
                          </p>
                        )}
                        {f.key === 'region' ? (
                          <select
                            required
                            className="w-full border px-3 py-2 rounded text-sm bg-white"
                            value={form.region}
                            onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                          >
                            {REGION_OPTIONS.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name} ({r.id})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            required={f.required !== false}
                            className="w-full border px-3 py-2 rounded font-mono text-sm"
                            value={form[f.key]}
                            onChange={set(f.key)}
                            placeholder={f.placeholder}
                            autoComplete="off"
                          />
                        )}
                      </div>
                    )
                  })}

                  <div>
                    <label className="block text-sm font-medium mb-1">{c.pemLabel}</label>
                    <p className="text-xs text-[#5a6f64] mb-1 leading-relaxed">{c.pemWhere}</p>
                    <p className="text-xs mb-2">
                      <a
                        className="underline font-semibold text-[#2f6b4f]"
                        href={ociLinks.myProfile}
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
