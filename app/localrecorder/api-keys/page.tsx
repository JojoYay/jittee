'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

const LINKS = {
  google: 'https://aistudio.google.com/apikey',
  nvidia: 'https://build.nvidia.com',
  groq: 'https://console.groq.com',
  openrouter: 'https://openrouter.ai',
  mistral: 'https://console.mistral.ai',
}

const BASE_URLS = {
  nvidia: 'https://integrate.api.nvidia.com/v1',
  groq: 'https://api.groq.com/openai/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  mistral: 'https://api.mistral.ai/v1',
}

function ExtLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
    >
      {label}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  )
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3 mt-5">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <span className="text-gray-700 leading-relaxed">{s}</span>
        </li>
      ))}
    </ol>
  )
}

function Code({ url }: { url: string }) {
  return <code className="px-2 py-1 rounded bg-gray-100 text-primary-700 text-sm font-mono break-all">{url}</code>
}

function MockFigure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="mt-6">
      {children}
      <figcaption className="mt-2 text-xs text-gray-400 text-center">{caption}</figcaption>
    </figure>
  )
}

export default function ApiKeysPage() {
  const { t } = useLanguage()

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <Link href="/localrecorder" className="text-cyan-50/90 hover:text-white text-sm">
            {t('apikeys.back')}
          </Link>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">{t('apikeys.title')}</h1>
          <p className="mt-4 text-lg text-cyan-50/90 max-w-2xl">{t('apikeys.subtitle')}</p>
          <span className="mt-5 inline-block px-3 py-1 rounded-full bg-white/15 text-sm backdrop-blur">
            {t('apikeys.asOf')}
          </span>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Google */}
        <div className="rounded-2xl border-2 border-primary-200 shadow-sm p-7 md:p-9">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{t('apikeys.gName')}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-xs font-bold">
              {t('apikeys.recommended')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-bold">
              {t('apikeys.free')}
            </span>
          </div>
          <p className="mt-3 text-gray-600">{t('apikeys.gDesc')}</p>
          <Steps items={[t('apikeys.gStep1'), t('apikeys.gStep2'), t('apikeys.gStep3'), t('apikeys.gStep4')]} />
          <MockFigure caption={t('apikeys.gShot')}>
            <img
              src="/api/google_ai_studio.jpg"
              alt="Google AI Studio — Create API key"
              className="w-full h-auto rounded-xl border border-gray-200 shadow-sm"
            />
          </MockFigure>
          <p className="mt-5 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{t('apikeys.gFree')}</p>
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">⚠️ {t('apikeys.gNote')}</p>
          <div className="mt-6">
            <ExtLink href={LINKS.google} label={t('apikeys.openSite')} />
          </div>
        </div>

        {/* NVIDIA */}
        <div className="rounded-2xl border border-gray-200 shadow-sm p-7 md:p-9">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{t('apikeys.nName')}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-bold">
              {t('apikeys.free')}
            </span>
          </div>
          <p className="mt-3 text-gray-600">{t('apikeys.nDesc')}</p>
          <Steps items={[t('apikeys.nStep1'), t('apikeys.nStep2'), t('apikeys.nStep3'), t('apikeys.nStep4')]} />
          <MockFigure caption={t('apikeys.nShot')}>
            <img
              src="/api/nvidia_deepseek.jpg"
              alt="NVIDIA Build — Generate API Key on a model page"
              className="w-full h-auto rounded-xl border border-gray-200 shadow-sm"
            />
          </MockFigure>
          <MockFigure caption={t('apikeys.nSetupShot')}>
            <img
              src="/api/deepseek_setting.jpg"
              alt="Local Recorder Custom (OpenAI-compat) tab filled in for NVIDIA"
              className="w-full h-auto rounded-xl border border-gray-200 shadow-sm"
            />
          </MockFigure>
          <p className="mt-5 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{t('apikeys.nFree')}</p>
          <p className="mt-3 text-sm text-gray-700">
            <span className="font-semibold">{t('apikeys.endpointLabel')}:</span> <Code url={BASE_URLS.nvidia} />
          </p>
          <div className="mt-6">
            <ExtLink href={LINKS.nvidia} label={t('apikeys.openSite')} />
          </div>
        </div>

        {/* Other free options */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('apikeys.othersTitle')}</h2>
          <p className="mt-2 text-gray-600">{t('apikeys.othersIntro')}</p>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Groq</h3>
                <a href={LINKS.groq} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm font-semibold hover:underline">{t('apikeys.openSite')} →</a>
              </div>
              <p className="mt-2 text-sm text-gray-600">{t('apikeys.groqDesc')}</p>
              <p className="mt-3"><Code url={BASE_URLS.groq} /></p>
            </div>
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">OpenRouter</h3>
                <a href={LINKS.openrouter} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm font-semibold hover:underline">{t('apikeys.openSite')} →</a>
              </div>
              <p className="mt-2 text-sm text-gray-600">{t('apikeys.orDesc')}</p>
              <p className="mt-3"><Code url={BASE_URLS.openrouter} /></p>
            </div>
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Mistral</h3>
                <a href={LINKS.mistral} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm font-semibold hover:underline">{t('apikeys.openSite')} →</a>
              </div>
              <p className="mt-2 text-sm text-gray-600">{t('apikeys.mistralDesc')}</p>
              <p className="mt-3"><Code url={BASE_URLS.mistral} /></p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">{t('apikeys.othersMore')}</p>
        </div>

        {/* Setup in Local Recorder */}
        <div className="rounded-2xl bg-gray-50 p-7 md:p-9">
          <h2 className="text-2xl font-bold text-gray-900">{t('apikeys.setupTitle')}</h2>
          <ul className="mt-5 space-y-3 text-gray-700">
            <li className="flex gap-3"><span className="text-primary-600 font-bold">•</span>{t('apikeys.setupGemini')}</li>
            <li className="flex gap-3"><span className="text-primary-600 font-bold">•</span>{t('apikeys.setupCompat')}</li>
          </ul>
        </div>

        {/* Security note */}
        <div className="rounded-2xl border border-gray-200 p-7 md:p-9">
          <h2 className="text-xl font-bold text-gray-900">🔒 {t('apikeys.noteTitle')}</h2>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex gap-3"><span className="text-gray-400">—</span>{t('apikeys.note1')}</li>
            <li className="flex gap-3"><span className="text-gray-400">—</span>{t('apikeys.note2')}</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link href="/localrecorder" className="text-primary-600 font-semibold hover:underline">
            {t('apikeys.back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
