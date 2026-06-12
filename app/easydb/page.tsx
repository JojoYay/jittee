'use client'

import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { sendGAEvent } from '@next/third-parties/google'
import ImageModal from '../components/ImageModal'

const DOWNLOAD_URL = 'https://github.com/JojoYay/EasyDB/releases/download/v5.3.8/EasyDB-v5.3.8.zip'

function Icon({ path, className = 'w-6 h-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const ICONS = {
  database: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  audit: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z',
  bolt: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  mask: 'M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88',
  download: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3',
  windows: 'M3 5.25 10.5 4.2v7.05H3V5.25Zm0 13.5L10.5 19.8v-7.05H3v6Zm9-15.3L21 2.25v9H12V3.45Zm0 17.1L21 21.75v-9.75H12v8.55Z',
}

export default function EasyDbPage() {
  const { t } = useLanguage()

  const trackDownload = (location: string) =>
    sendGAEvent('event', 'file_download', { file_name: 'EasyDB-v5.3.8.zip', location })

  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(null)

  const screenshots = [
    { src: '/easydb/screen.jpg', captionKey: 'edb.shot1Caption' },
    // { src: '/easydb/mask.png', captionKey: 'edb.shot2Caption' }, // add when the masking screenshot is provided
  ]

  const valueProps = [
    { icon: ICONS.audit, title: 'edb.vp1Title', desc: 'edb.vp1Desc' },
    { icon: ICONS.bolt, title: 'edb.vp2Title', desc: 'edb.vp2Desc' },
    { icon: ICONS.mask, title: 'edb.vp3Title', desc: 'edb.vp3Desc' },
  ]

  const databases = ['Oracle', 'IBM DB2', 'MySQL', 'PostgreSQL']

  const steps = [
    { title: 'edb.step1Title', desc: 'edb.step1Desc' },
    { title: 'edb.step2Title', desc: 'edb.step2Desc' },
    { title: 'edb.step3Title', desc: 'edb.step3Desc' },
  ]

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, white 0, transparent 38%), radial-gradient(circle at 85% 10%, white 0, transparent 32%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium backdrop-blur">
                <Icon path={ICONS.windows} className="w-4 h-4" />
                {t('edb.badge')}
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {t('edb.heroTitle')}
              </h1>
              <p className="mt-5 text-lg md:text-xl text-indigo-50/90 leading-relaxed">
                {t('edb.heroSubtitle')}
              </p>
              <p className="mt-3 text-sm text-indigo-100/80">{t('edb.heroDesc')}</p>
              <div className="mt-8">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDownload('hero')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-indigo-700 font-semibold shadow-lg hover:bg-indigo-50 transition-colors"
                >
                  <Icon path={ICONS.download} className="w-5 h-5" />
                  {t('edb.download')}
                </a>
                <p className="mt-4 text-sm text-indigo-100/80">{t('edb.downloadSub')}</p>
              </div>
              {/* supported DBs */}
              <div className="mt-10">
                <p className="text-xs uppercase tracking-wider text-indigo-200/80 mb-3">{t('edb.supportedTitle')}</p>
                <div className="flex flex-wrap gap-2">
                  {databases.map((db) => (
                    <span key={db} className="px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-sm font-medium">
                      {db}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 bg-white/15 rounded-[2rem] blur-2xl" />
                <img
                  src="/easydb/easyDb.png"
                  alt="EasyDB"
                  className="relative w-56 h-56 md:w-72 md:h-72 rounded-[2rem] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Value props ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((vp) => (
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

      {/* ===== Screenshots ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">{t('edb.screenshotsTitle')}</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {screenshots.map((s) => (
              <figure
                key={s.src}
                className="cursor-pointer group"
                onClick={() => setModalImage({ src: s.src, alt: t(s.captionKey), title: t(s.captionKey) })}
              >
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow bg-gray-50">
                  <img src={s.src} alt={t(s.captionKey)} className="w-full h-auto" />
                </div>
                <figcaption className="mt-3 text-sm text-gray-600 text-center group-hover:text-gray-900">{t(s.captionKey)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Install steps ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('edb.installTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">{t('edb.installSub')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title}>
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

      {/* ===== Final CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">{t('edb.ctaTitle')}</h2>
          <p className="text-lg text-indigo-50/90 mb-9">{t('edb.ctaDesc')}</p>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload('footer_cta')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-indigo-700 font-bold text-lg shadow-lg hover:bg-indigo-50 transition-colors"
          >
            <Icon path={ICONS.download} className="w-6 h-6" />
            {t('edb.ctaButton')}
          </a>
          <p className="mt-4 text-sm text-indigo-100/80">{t('edb.ctaNote')}</p>
        </div>
      </section>

      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          title={modalImage.title}
        />
      )}
    </div>
  )
}
