'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

function Icon({ path, className = 'w-6 h-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const ICONS = {
  database: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  banknote: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
  searchX: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 7.5l-6 6m0-6 6 6',
  face: 'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  hashtag: 'M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5',
  upload: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5',
  tag: 'M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z',
  camera: 'M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
  users: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  trophy: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0',
  eye: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
}

export default function SpotMyShotPage() {
  const { t, locale } = useLanguage()
  const mangaSrc = locale === 'ja' ? '/spotmyshot/manga-ja.svg' : '/spotmyshot/manga-en.svg'
  const more = locale === 'ja' ? '詳しく見る →' : locale === 'zh' ? '了解更多 →' : 'Learn more →'

  const problems = [
    { icon: ICONS.database, title: 'sms.p1Title', desc: 'sms.p1Desc' },
    { icon: ICONS.banknote, title: 'sms.p2Title', desc: 'sms.p2Desc' },
    { icon: ICONS.searchX, title: 'sms.p3Title', desc: 'sms.p3Desc' },
  ]

  const features = [
    { icon: ICONS.face, title: 'sms.f1Title', desc: 'sms.f1Desc' },
    { icon: ICONS.hashtag, title: 'sms.f2Title', desc: 'sms.f2Desc' },
    { icon: ICONS.eye, title: 'sms.f3Title', desc: 'sms.f3Desc' },
    { icon: ICONS.banknote, title: 'sms.f4Title', desc: 'sms.f4Desc' },
  ]

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 12% 20%, rgba(37,99,235,0.10) 0, transparent 42%), radial-gradient(circle at 88% 15%, rgba(249,115,22,0.12) 0, transparent 40%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/spotmyshot/spotMyShot_logo.png" alt="SpotMyShot" className="h-10 md:h-14 w-auto" />
              <h1 className="sr-only">SpotMyShot</h1>
              <span className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                {t('sms.badge')}
              </span>
              <p className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {t('sms.heroTitle')}
              </p>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">{t('sms.heroDesc')}</p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 transition-opacity"
                >
                  {t('sms.cta')}
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-blue-200/40 to-orange-200/40 rounded-[2.5rem] blur-2xl" />
                <img src="/spotmyshot/spotMyShot_icon.png" alt="SpotMyShot" className="relative w-56 h-56 md:w-80 md:h-80 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Problems ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('sms.problemsTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">{t('sms.problemsIntro')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="w-14 h-14 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
                  <Icon path={p.icon} className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t(p.title)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(p.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Solution band ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('sms.solutionTitle')}</h2>
          <p className="text-lg text-white/90 leading-relaxed">{t('sms.solutionDesc')}</p>
        </div>
      </section>

      {/* ===== Comic ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">{t('sms.comicTitle')}</h2>
          <img
            src={mangaSrc}
            alt={t('sms.comicTitle')}
            className="w-full h-auto rounded-xl border border-gray-100 shadow-sm"
          />
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{t('sms.featuresTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Icon path={f.icon} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{t(f.title)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Audience ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Icon path={ICONS.camera} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('sms.forPhotographersTitle')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('sms.forPhotographersDesc')}</p>
              <Link href="/spotmyshot/photographers" className="mt-5 inline-block text-blue-600 font-semibold hover:underline">{more}</Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5">
                <Icon path={ICONS.users} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('sms.forParticipantsTitle')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('sms.forParticipantsDesc')}</p>
              <Link href="/spotmyshot/participants" className="mt-5 inline-block text-orange-600 font-semibold hover:underline">{more}</Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Icon path={ICONS.trophy} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('sms.forOrganizersTitle')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('sms.forOrganizersDesc')}</p>
              <Link href="/spotmyshot/organizers" className="mt-5 inline-block text-blue-600 font-semibold hover:underline">{more}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">{t('sms.ctaTitle')}</h2>
          <p className="text-lg text-white/90 mb-9">{t('sms.ctaDesc')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-700 font-bold text-lg shadow-lg hover:bg-blue-50 transition-colors"
          >
            {t('sms.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  )
}
