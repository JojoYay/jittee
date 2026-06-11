'use client'

import { useLanguage } from '../contexts/LanguageContext'

const DOWNLOAD_URL = 'https://github.com/JojoYay/localRecorder-releases/releases/latest'
const GITHUB_URL = 'https://github.com/JojoYay/localRecorder-releases'

function Icon({ path, className = 'w-6 h-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

// Heroicon-style outline paths
const ICONS = {
  layers: 'M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3',
  mic: 'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z',
  bolt: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  captions: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v8.25A2.25 2.25 0 0 1 18 16.5h-2.25l-3.75 3.75V16.5H6a2.25 2.25 0 0 1-2.25-2.25V6Z',
  cpuChip: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z',
  template: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  importArrow: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5',
  paperclip: 'm18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13',
  globe: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  shield: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  windows: 'M3 5.25 10.5 4.2v7.05H3V5.25Zm0 13.5L10.5 19.8v-7.05H3v6Zm9-15.3L21 2.25v9H12V3.45Zm0 17.1L21 21.75v-9.75H12v8.55Z',
  download: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3',
  github: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z',
}

export default function LocalRecorderPage() {
  const { t } = useLanguage()

  const features = [
    { icon: ICONS.layers, title: 'lr.f1Title', desc: 'lr.f1Desc' },
    { icon: ICONS.mic, title: 'lr.f2Title', desc: 'lr.f2Desc' },
    { icon: ICONS.bolt, title: 'lr.f3Title', desc: 'lr.f3Desc' },
    { icon: ICONS.clock, title: 'lr.f4Title', desc: 'lr.f4Desc' },
    { icon: ICONS.captions, title: 'lr.f5Title', desc: 'lr.f5Desc' },
    { icon: ICONS.cpuChip, title: 'lr.f6Title', desc: 'lr.f6Desc' },
    { icon: ICONS.template, title: 'lr.f7Title', desc: 'lr.f7Desc' },
    { icon: ICONS.importArrow, title: 'lr.f8Title', desc: 'lr.f8Desc' },
    { icon: ICONS.paperclip, title: 'lr.f9Title', desc: 'lr.f9Desc' },
    { icon: ICONS.globe, title: 'lr.f10Title', desc: 'lr.f10Desc' },
  ]

  const steps = [
    { title: 'lr.step1Title', desc: 'lr.step1Desc' },
    { title: 'lr.step2Title', desc: 'lr.step2Desc' },
    { title: 'lr.step3Title', desc: 'lr.step3Desc' },
    { title: 'lr.step4Title', desc: 'lr.step4Desc' },
  ]

  const providers = ['Gemini', 'OpenAI', 'Anthropic', 'Azure OpenAI', 'Ollama', 'Groq']

  const faqs = [
    { q: 'lr.q1', a: 'lr.a1' },
    { q: 'lr.q2', a: 'lr.a2' },
    { q: 'lr.q3', a: 'lr.a3' },
    { q: 'lr.q4', a: 'lr.a4' },
  ]

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 0%, white 0, transparent 35%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium backdrop-blur">
                <Icon path={ICONS.windows} className="w-4 h-4" />
                {t('lr.badge')}
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {t('lr.heroTitle')}
              </h1>
              <p className="mt-5 text-lg md:text-xl text-cyan-50/90 leading-relaxed">
                {t('lr.heroSubtitle')}
              </p>
              <p className="mt-3 text-sm text-cyan-100/80 flex items-start gap-2">
                <Icon path={ICONS.shield} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {t('lr.heroDesc')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-blue-700 font-semibold shadow-lg hover:bg-cyan-50 transition-colors"
                >
                  <Icon path={ICONS.download} className="w-5 h-5" />
                  {t('lr.download')}
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  <Icon path={ICONS.github} className="w-5 h-5" />
                  {t('lr.github')}
                </a>
              </div>
              <p className="mt-4 text-sm text-cyan-100/80">{t('lr.downloadSub')}</p>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 bg-white/20 rounded-[2rem] blur-2xl" />
                <img
                  src="/localrecorder/icon.png"
                  alt="Local Recorder"
                  className="relative w-56 h-56 md:w-72 md:h-72 rounded-[2rem] shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* trust strip */}
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cyan-50/90">
            <span className="flex items-center gap-2"><Icon path={ICONS.shield} className="w-4 h-4" />{t('lr.trustPrivacy')}</span>
            <span className="flex items-center gap-2"><Icon path={ICONS.cpuChip} className="w-4 h-4" />{t('lr.trustProviders')}</span>
            <span className="flex items-center gap-2"><Icon path={ICONS.globe} className="w-4 h-4" />{t('lr.trustLang')}</span>
          </div>
        </div>
      </section>

      {/* ===== Value props ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ICONS.bolt, title: 'lr.vp1Title', desc: 'lr.vp1Desc' },
              { icon: ICONS.shield, title: 'lr.vp2Title', desc: 'lr.vp2Desc' },
              { icon: ICONS.cpuChip, title: 'lr.vp3Title', desc: 'lr.vp3Desc' },
            ].map((vp) => (
              <div key={vp.title} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-5">
                  <Icon path={vp.icon} className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(vp.title)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(vp.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('lr.featuresTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">{t('lr.featuresSubtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="border border-gray-100 rounded-xl p-6 hover:border-primary-200 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <Icon path={f.icon} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(f.title)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('lr.howTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">{t('lr.howSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white font-bold text-lg flex items-center justify-center mb-5 shadow-md">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(s.title)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(s.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Privacy ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-10 md:p-14 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={ICONS.shield} className="w-8 h-8 text-cyan-300" />
              <h2 className="text-2xl md:text-3xl font-bold">{t('lr.privacyTitle')}</h2>
            </div>
            <p className="text-blue-100/90 text-lg mb-8 max-w-3xl">{t('lr.privacyDesc')}</p>
            <ul className="space-y-4 max-w-3xl">
              {['lr.privacyP1', 'lr.privacyP2', 'lr.privacyP3'].map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <Icon path={ICONS.shield} className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-1" />
                  <span className="text-blue-50/90">{t(k)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Providers ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('lr.providersTitle')}</h2>
          <p className="mt-3 text-gray-600">{t('lr.providersDesc')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {providers.map((p) => (
              <span key={p} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium shadow-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('lr.pricingTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">{t('lr.pricingSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-500">{t('lr.colFree')}</h3>
              <p className="mt-2 text-4xl font-extrabold text-gray-900">{t('lr.rowPriceFree')}</p>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li className="flex justify-between border-b border-gray-100 pb-3"><span>{t('lr.rowLength')}</span><span className="font-medium text-gray-900">{t('lr.rowLengthFree')}</span></li>
                <li className="flex justify-between border-b border-gray-100 pb-3"><span>{t('lr.rowMeetings')}</span><span className="font-medium text-gray-900">{t('lr.rowMeetingsFree')}</span></li>
                <li className="flex justify-between"><span>{t('lr.rowWatermark')}</span><span className="font-medium text-gray-900">{t('lr.rowWatermarkFree')}</span></li>
              </ul>
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="mt-8 block text-center px-6 py-3 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
                {t('lr.download')}
              </a>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-primary-600 p-8 shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-600 text-white text-xs font-bold tracking-wide">PRO</span>
              <h3 className="text-lg font-semibold text-primary-600">{t('lr.colPro')}</h3>
              <p className="mt-2 text-4xl font-extrabold text-gray-900">{t('lr.rowPricePro')}</p>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li className="flex justify-between border-b border-gray-100 pb-3"><span>{t('lr.rowLength')}</span><span className="font-medium text-gray-900">{t('lr.rowLengthPro')}</span></li>
                <li className="flex justify-between border-b border-gray-100 pb-3"><span>{t('lr.rowMeetings')}</span><span className="font-medium text-gray-900">{t('lr.rowMeetingsPro')}</span></li>
                <li className="flex justify-between"><span>{t('lr.rowWatermark')}</span><span className="font-medium text-gray-900">{t('lr.rowWatermarkPro')}</span></li>
              </ul>
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="mt-8 block text-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
                {t('lr.download')}
              </a>
              <p className="mt-3 text-xs text-gray-500 text-center">{t('lr.proNote')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">{t('lr.faqTitle')}</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-gray-200 p-6 [&_svg]:open:rotate-180">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900">
                  {t(f.q)}
                  <Icon path="M19.5 8.25 12 15.75 4.5 8.25" className="w-5 h-5 text-gray-400 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">{t('lr.ctaTitle')}</h2>
          <p className="text-lg text-cyan-50/90 mb-9">{t('lr.ctaDesc')}</p>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-700 font-bold text-lg shadow-lg hover:bg-cyan-50 transition-colors"
          >
            <Icon path={ICONS.download} className="w-6 h-6" />
            {t('lr.ctaButton')}
          </a>
          <p className="mt-4 text-sm text-cyan-100/80">{t('lr.ctaNote')}</p>
        </div>
      </section>
    </div>
  )
}
