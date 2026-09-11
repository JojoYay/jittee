'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import type { JobPublicStatus } from '@/lib/minorwire/provision/types'
import { useLanguage } from '../../contexts/LanguageContext'
import { useMinorWireStripeMode } from '../StripeModeContext'
import { SETUP_COPY } from './copy'
import { buildOciLinks } from './ociLinks'
import { parseOciConfig } from './parseOciConfig'
import { defaultRegionForLocale, REGION_OPTIONS } from './regions'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type FormState = {
  region: string
  ociConfig: string
  tenancyOcid: string
  userOcid: string
  fingerprint: string
  privateKeyPem: string
  peerName: string
}

function emptyFormForLocale(locale: string): FormState {
  return {
    region: defaultRegionForLocale(locale),
    ociConfig: '',
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
  const { links } = useMinorWireStripeMode()
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
  const [pemFileName, setPemFileName] = useState('')
  const [pemFileError, setPemFileError] = useState('')
  const lastKickAtRef = useRef(0)
  const ociLinks = buildOciLinks(form.region)
  const regionSelectOptions = REGION_OPTIONS.some((r) => r.id === form.region)
    ? [...REGION_OPTIONS]
    : [...REGION_OPTIONS, { id: form.region, name: form.region }]

  useEffect(() => {
    setForm((f) => ({ ...f, region: defaultRegionForLocale(locale) }))
  }, [locale])

  const kickRun = useCallback(
    async (
      jobId: string,
      opts?: {
        force?: boolean
        creds?: {
          region: string
          tenancyOcid: string
          compartmentOcid: string
          userOcid: string
          fingerprint: string
          privateKeyPem: string
        }
        peerName?: string
      },
    ) => {
      if (!sessionId) return
      const now = Date.now()
      if (!opts?.force && now - lastKickAtRef.current < 20_000) return
      lastKickAtRef.current = now
      try {
        await fetch(`/api/minorwire/jobs/${encodeURIComponent(jobId)}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            peerName: opts?.peerName,
            creds: opts?.creds,
          }),
          // Keep the request alive if the tab is backgrounded briefly.
          keepalive: true,
        })
      } catch {
        /* status polling still recovers via server re-kick */
      }
    },
    [sessionId],
  )

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
        if (data.job) {
          setJob(data.job)
          if (data.needsClientKick && data.job.id) void kickRun(data.job.id)
        }
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
  }, [sessionId, c.missingSession, c.paymentUnverified, c.verifyFailed, kickRun])

  useEffect(() => {
    if (!job || !sessionId) return
    if (job.phase === 'done' || job.phase === 'error') return
    const t = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/minorwire/jobs/${encodeURIComponent(job.id)}?session_id=${encodeURIComponent(sessionId)}`,
        )
        const data = await res.json()
        if (res.ok && data.job) {
          setJob(data.job)
          if (data.needsClientKick) void kickRun(job.id)
        }
      } catch {
        /* ignore poll errors */
      }
    }, 4000)
    return () => clearInterval(t)
  }, [job, sessionId, kickRun])

  const applyOciConfig = useCallback((text: string) => {
    const parsed = parseOciConfig(text)
    setForm((f) => ({
      ...f,
      ociConfig: text,
      ...(parsed
        ? {
            userOcid: parsed.userOcid,
            fingerprint: parsed.fingerprint,
            tenancyOcid: parsed.tenancyOcid,
            region: parsed.region,
          }
        : {
            userOcid: '',
            fingerprint: '',
            tenancyOcid: '',
          }),
    }))
  }, [])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!sessionId || submitting) return
      setSubmitting(true)
      setSubmitError('')
      const parsed = parseOciConfig(form.ociConfig)
      if (!parsed) {
        setSubmitError(c.ociConfigInvalid)
        setSubmitting(false)
        return
      }
      const tenancy = parsed.tenancyOcid
      const creds = {
        region: parsed.region,
        tenancyOcid: tenancy,
        compartmentOcid: tenancy,
        userOcid: parsed.userOcid,
        fingerprint: parsed.fingerprint,
        privateKeyPem: form.privateKeyPem,
      }
      try {
        const res = await fetch('/api/minorwire/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            peerName: form.peerName,
            region: creds.region,
            tenancyOcid: creds.tenancyOcid,
            // Admin simple path: root compartment == tenancy OCID
            compartmentOcid: creds.compartmentOcid,
            userOcid: creds.userOcid,
            fingerprint: creds.fingerprint,
            privateKeyPem: creds.privateKeyPem,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setSubmitError(data.error || c.failedStart)
          return
        }
        setJob(data.job)
        // Primary runner start: dedicated /run request (Cloud Run CPU). Pass creds so
        // provision can start even if encrypted payload read fails.
        if (data.job?.id && (data.needsClientKick || data.job.phase === 'queued')) {
          void kickRun(data.job.id, { force: true, creds, peerName: form.peerName })
        }
      } catch {
        setSubmitError(c.networkError)
      } finally {
        setSubmitting(false)
      }
    },
    [sessionId, submitting, form, c.failedStart, c.networkError, c.ociConfigInvalid, kickRun],
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

  const onPemFile = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0]
      setPemFileError('')
      if (!file) {
        setPemFileName('')
        setForm((f) => ({ ...f, privateKeyPem: '' }))
        return
      }
      try {
        const text = await file.text()
        if (!text.includes('PRIVATE KEY')) {
          setPemFileName('')
          setForm((f) => ({ ...f, privateKeyPem: '' }))
          setPemFileError(c.pemFileInvalid)
          ev.target.value = ''
          return
        }
        setPemFileName(file.name)
        setForm((f) => ({ ...f, privateKeyPem: text }))
      } catch {
        setPemFileName('')
        setForm((f) => ({ ...f, privateKeyPem: '' }))
        setPemFileError(c.pemFileInvalid)
        ev.target.value = ''
      }
    },
    [c.pemFileInvalid],
  )

  const clearPemFile = useCallback(() => {
    setPemFileName('')
    setPemFileError('')
    setForm((f) => ({ ...f, privateKeyPem: '' }))
  }, [])

  const running = job && job.phase !== 'done' && job.phase !== 'error'
  const showForm = gate === 'ok' && (!job || job.phase === 'error')
  const ociConfigOk = Boolean(parseOciConfig(form.ociConfig))

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
                <p className="text-xs text-[#5a6f64] mt-2">
                  {c.lastUpdated(new Date(job.updatedAt || job.createdAt).toLocaleString())}
                </p>
                {job.publicIp && (
                  <p className="mt-2 text-sm font-mono text-[#2f6b4f]">
                    {c.publicIp}: {job.publicIp}
                  </p>
                )}
                {job.displayName && (
                  <p className="mt-1 text-sm font-mono text-[#2f6b4f]">
                    {c.instanceName}: {job.displayName}
                  </p>
                )}
                {job.error && <p className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{job.error}</p>}
                {job.phase === 'error' && <p className="mt-2 text-sm text-[#5a6f64]">{c.retryHint}</p>}
                {running && <p className="mt-3 text-sm text-[#5a6f64]">{c.working}</p>}
                {job.logs && job.logs.length > 0 && (
                  <div className="mt-4 border-t border-[#1d3d2e]/10 pt-3">
                    <p className="text-sm font-semibold mb-2">{c.recentSteps}</p>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto text-xs font-mono text-[#3a4f44]">
                      {job.logs.slice(-12).map((log) => (
                        <li key={`${log.at}-${log.step}-${log.message.slice(0, 24)}`}>
                          <span className="text-[#5a6f64]">
                            {new Date(log.at).toLocaleTimeString()} [{log.step}]
                          </span>{' '}
                          {log.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

                    {sku === 'minorwire_app' && (
                      <div className="border border-[#1d3d2e]/20 bg-[#e8f2ec]/70 rounded-md p-5 space-y-3">
                        <p className={`${syne.className} text-lg font-bold`}>{c.supportUpsellTitle}</p>
                        <p className="text-sm text-[#3a4f44] leading-relaxed">{c.supportUpsellBody}</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href={links.support}
                            className="inline-flex justify-center px-5 py-2.5 rounded-md bg-[#1d3d2e] text-white font-semibold text-sm"
                          >
                            {c.supportUpsellCta}
                          </a>
                          <a
                            href={c.supportWhatsAppUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex justify-center px-5 py-2.5 rounded-md border border-[#1d3d2e] font-semibold text-sm"
                          >
                            {c.supportWhatsAppLabel} ({c.supportWhatsAppPhone})
                          </a>
                        </div>
                      </div>
                    )}

                    <section className="border border-[#1d3d2e]/15 bg-white rounded-md overflow-hidden">
                      <div className="p-5 space-y-3">
                        <h3 className={`${syne.className} text-xl font-bold`}>{c.wgConnectTitle}</h3>
                        <p className="text-sm text-[#3a4f44] leading-relaxed">{c.wgConnectIntro}</p>
                        <p className="text-sm">
                          <a
                            className="underline font-semibold text-[#2f6b4f]"
                            href={c.wgHubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {c.wgHubLabel}
                          </a>
                        </p>
                      </div>

                      <article className="border-t border-[#1d3d2e]/10">
                        <div className="p-5 space-y-2">
                          <h4 className="font-semibold text-[#1d3d2e]">{c.wgDownloadStepTitle}</h4>
                          <p className="text-sm text-[#3a4f44] leading-relaxed">{c.wgDownloadStepBody}</p>
                        </div>
                        <figure>
                          <Image
                            src={c.wgDownloadStepImage}
                            alt={c.wgDownloadStepImageAlt}
                            width={1280}
                            height={720}
                            className="w-full h-auto border-t border-[#1d3d2e]/10"
                          />
                        </figure>
                      </article>

                      {c.wgPlatforms.map((plat) => (
                        <article key={plat.id} className="border-t border-[#1d3d2e]/10">
                          <div className="p-5 space-y-3">
                            <h4 className={`${syne.className} text-lg font-bold`}>{plat.title}</h4>
                            <p className="text-sm">
                              <a
                                className="underline font-semibold text-[#2f6b4f]"
                                href={plat.installUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {plat.installLabel}
                              </a>
                            </p>
                            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[#3a4f44]">
                              {plat.steps.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ol>
                          </div>
                          <figure>
                            <Image
                              src={plat.image}
                              alt={plat.imageAlt}
                              width={plat.id === 'ios' || plat.id === 'android' ? 720 : 1280}
                              height={plat.id === 'ios' || plat.id === 'android' ? 1280 : 720}
                              className="w-full max-w-md mx-auto h-auto border-t border-[#1d3d2e]/10 bg-[#f7faf8]"
                            />
                          </figure>
                        </article>
                      ))}

                      <article className="border-t border-[#1d3d2e]/10">
                        <div className="p-5 space-y-3">
                          <h4 className={`${syne.className} text-lg font-bold`}>{c.wgActivateTitle}</h4>
                          <p className="text-sm text-[#3a4f44] leading-relaxed">{c.wgActivateBody}</p>
                          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[#3a4f44]">
                            {c.wgActivateSteps.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ol>
                        </div>
                        <figure>
                          <Image
                            src={c.wgActivateImage}
                            alt={c.wgActivateImageAlt}
                            width={1280}
                            height={720}
                            className="w-full h-auto border-t border-[#1d3d2e]/10"
                          />
                        </figure>
                      </article>
                    </section>

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
              <form onSubmit={onSubmit} className="space-y-8">
                <section className="space-y-5">
                  <div>
                    <h2 className={`${syne.className} text-2xl font-bold`}>{c.guideTitle}</h2>
                    <p className="text-sm text-[#3a4f44] mt-2 leading-relaxed">{c.guideIntro}</p>
                  </div>
                  {c.guideSteps.map((step) => {
                    const stepHref = step.ociLink ? ociLinks[step.ociLink] : step.link
                    const stepFields = (step.fields ?? [])
                      .map((key) => c.fields.find((f) => f.key === key))
                      .filter((f): f is (typeof c.fields)[number] => Boolean(f))
                    const stepImages =
                      step.images && step.images.length > 0
                        ? step.images
                        : [{ src: step.image, alt: step.imageAlt }]
                    return (
                      <article
                        key={step.id}
                        className="border border-[#1d3d2e]/15 bg-white rounded-md overflow-hidden"
                      >
                        <div className="p-5 space-y-3">
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
                          {step.clickSteps && step.clickSteps.length > 0 && (
                            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[#3a4f44]">
                              {step.clickSteps.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ol>
                          )}
                        </div>
                        {stepImages.map((img) => (
                          <figure key={img.src + (img.caption || '')}>
                            <Image
                              src={img.src}
                              alt={img.alt}
                              width={1280}
                              height={720}
                              className="w-full h-auto border-t border-[#1d3d2e]/10"
                            />
                            {img.caption && (
                              <figcaption className="px-5 py-2 text-xs text-[#5a6f64] bg-[#f7faf8] border-t border-[#1d3d2e]/5">
                                {img.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}

                        {(stepFields.length > 0 || step.showPem || step.showSubmit) && (
                          <div className="space-y-4 border-t border-[#2f6b4f]/20 bg-[#e8f2ec]/60 p-5">
                            {step.showPem && (
                              <div>
                                <label className="block text-sm font-medium mb-1">{c.pemLabel}</label>
                                <p className="text-xs text-[#5a6f64] mb-1 leading-relaxed">{c.pemWhere}</p>
                                <p className="text-xs mb-2">
                                  <a
                                    className="underline font-semibold text-[#2f6b4f]"
                                    href={ociLinks.authTokens}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {c.pemUrlLabel}
                                  </a>
                                </p>
                                <input
                                  required={!form.privateKeyPem}
                                  type="file"
                                  accept=".pem,application/x-pem-file,application/pkcs8,*/*"
                                  className="block w-full text-sm text-[#3a4f44] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-[#1d3d2e] file:text-white file:font-semibold"
                                  onChange={onPemFile}
                                />
                                {pemFileName && (
                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#2f6b4f]">
                                    <span>{c.pemFileReady(pemFileName)}</span>
                                    <button
                                      type="button"
                                      onClick={clearPemFile}
                                      className="underline text-[#5a6f64]"
                                    >
                                      {c.pemFileClear}
                                    </button>
                                  </div>
                                )}
                                {pemFileError && (
                                  <p className="mt-2 text-sm text-red-700">{pemFileError}</p>
                                )}
                              </div>
                            )}

                            {stepFields.map((f) => {
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
                                      onChange={(e) =>
                                        setForm((prev) => ({ ...prev, region: e.target.value }))
                                      }
                                    >
                                      {regionSelectOptions.map((r) => (
                                        <option key={r.id} value={r.id}>
                                          {r.name} ({r.id})
                                        </option>
                                      ))}
                                    </select>
                                  ) : f.key === 'ociConfig' ? (
                                    <>
                                      <textarea
                                        required
                                        rows={8}
                                        className="w-full border px-3 py-2 rounded font-mono text-xs bg-white"
                                        value={form.ociConfig}
                                        onChange={(e) => applyOciConfig(e.target.value)}
                                        placeholder={f.placeholder}
                                        autoComplete="off"
                                        spellCheck={false}
                                      />
                                      {form.ociConfig.trim() && (
                                        <p
                                          className={`mt-2 text-xs ${ociConfigOk ? 'text-[#2f6b4f]' : 'text-red-700'}`}
                                        >
                                          {ociConfigOk ? c.ociConfigOk : c.ociConfigInvalid}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <input
                                      required={f.required !== false}
                                      className="w-full border px-3 py-2 rounded font-mono text-sm bg-white"
                                      value={form[f.key]}
                                      onChange={set(f.key)}
                                      placeholder={f.placeholder}
                                      autoComplete="off"
                                    />
                                  )}
                                </div>
                              )
                            })}

                            {step.showSubmit && (
                              <div className="space-y-3 pt-1">
                                {submitError && <p className="text-red-700 text-sm">{submitError}</p>}
                                <button
                                  type="submit"
                                  disabled={submitting}
                                  className="px-6 py-3 rounded-md bg-[#1d3d2e] text-white font-semibold disabled:opacity-60"
                                >
                                  {submitting ? c.submitBusy : c.submit}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    )
                  })}
                </section>
              </form>
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
