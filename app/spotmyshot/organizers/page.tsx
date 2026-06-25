'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

function Icon({ path, className = 'w-6 h-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const ICONS = {
  banknote: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
  camera: 'M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
  heart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  sliders: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75',
  eye: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
}

const COPY = {
  ja: {
    badge: '大会運営者の方へ',
    heroTitle: '大会に、新しい収入源を。',
    heroDesc: '参加者がいちばん欲しがる「自分の写真」。SpotMyShot なら、カメラマンを大がかりに手配しなくても、参加者へ写真を届けながら、大会に新たな収益をもたらします。',
    ctaPrimary: '導入を相談する',
    ctaSecondary: 'SpotMyShotとは',
    simTitle: '1,000人規模で、どれくらい？収益シミュレーター',
    simDesc: '参加者数や購入率を動かして、大会にもたらす収益の目安を試算できます。',
    simParticipants: '参加者数',
    simBuyRate: '写真を購入する参加者の割合',
    simAvgSpend: '購入者1人あたりの平均購入額',
    simOrgShare: '大会運営者の取り分',
    simBuyers: '写真を購入する人数',
    simGross: '写真の想定総売上',
    simOrgRevenue: 'うち大会運営者の収益',
    simPerEvent: '／ 1大会あたり',
    simNote: '※あくまで目安です。実際の数値は大会の規模・公開する写真の枚数・価格設定・購入率によって変わります。',
    unit: '人',
    benefitsTitle: '大会運営者にとってのメリット',
    benefits: [
      { icon: 'camera', title: 'カメラマンの手配が柔軟', desc: 'フリーのカメラマンを無料で登録させてもよし、雇っているカメラマンを担当にしてもよし。大会の規模や予算に合わせて選べます。' },
      { icon: 'heart', title: '写真で参加者を囲い込む', desc: '「自分の写真がある」体験は、参加者の満足度とリピートにつながります。来年もこの大会に出たい——その理由をつくれます。' },
      { icon: 'banknote', title: '安く始められる', desc: '間接費の少ない自動運用なので、初期費用を抑えて手軽にスタートできます。' },
      { icon: 'eye', title: '柔軟な検索設定', desc: '「自分の写真だけ検索できる」設定も、「すべての写真を検索できる」設定も可能。大会の方針に合わせて選べます。' },
    ],
    ctaTitle: '大会の価値を、写真で高める。',
    ctaDesc: '導入のご相談・お見積りはお気軽にどうぞ。御社の大会に合わせた運用をご提案します。',
    ctaButton: '導入を相談する',
  },
  en: {
    badge: 'For Event Organizers',
    heroTitle: 'A new revenue stream for your event.',
    heroDesc: 'Participants want their own photos most of all. With SpotMyShot you can deliver photos to participants — and bring new revenue to your event — without arranging photographers on a large scale.',
    ctaPrimary: 'Talk to us',
    ctaSecondary: 'What is SpotMyShot?',
    simTitle: 'How much at 1,000 participants? Revenue simulator',
    simDesc: 'Move the sliders for participant count and purchase rate to estimate the revenue your event could earn.',
    simParticipants: 'Participants',
    simBuyRate: 'Share of participants who buy photos',
    simAvgSpend: 'Average spend per buyer',
    simOrgShare: 'Organizer revenue share',
    simBuyers: 'Participants who buy',
    simGross: 'Estimated gross photo sales',
    simOrgRevenue: 'Organizer revenue from that',
    simPerEvent: '/ per event',
    simNote: '* Figures are illustrative only. Actual results vary with event size, number of photos published, pricing and purchase rate.',
    unit: '',
    benefitsTitle: 'What organizers get',
    benefits: [
      { icon: 'camera', title: 'Flexible photographer setup', desc: 'Register freelance photographers for free, or assign photographers you already employ. Choose what fits your event size and budget.' },
      { icon: 'heart', title: 'Keep participants coming back', desc: 'The experience of "my photos are here" drives satisfaction and repeat sign-ups — a reason to return to your event next year.' },
      { icon: 'banknote', title: 'Cheap to start', desc: 'Automated operation with low overhead means you can start easily, with minimal upfront cost.' },
      { icon: 'eye', title: 'Flexible search settings', desc: 'Allow "search only your own photos" or "search all photos" — configure it to match your event policy.' },
    ],
    ctaTitle: 'Raise the value of your event with photos.',
    ctaDesc: 'Reach out anytime for a consultation or quote. We will propose a setup tailored to your event.',
    ctaButton: 'Talk to us',
  },
}

function Slider({
  label, value, min, max, step, onChange, display,
}: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-base font-bold text-gray-900 tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500 cursor-pointer"
      />
    </div>
  )
}

export default function OrganizersPage() {
  const { locale } = useLanguage()
  const c = locale === 'ja' ? COPY.ja : COPY.en
  const isJa = locale === 'ja'

  const [participants, setParticipants] = useState(1000)
  const [buyRate, setBuyRate] = useState(30)
  const [avgSpend, setAvgSpend] = useState(isJa ? 1500 : 15)
  const [orgShare, setOrgShare] = useState(20)

  const cur = isJa ? '¥' : 'S$'
  const nf = new Intl.NumberFormat(isJa ? 'ja-JP' : 'en-SG')
  const money = (n: number) => cur + nf.format(Math.round(n))

  const buyers = Math.round(participants * (buyRate / 100))
  const gross = buyers * avgSpend
  const orgRevenue = gross * (orgShare / 100)

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 12% 20%, rgba(37,99,235,0.10) 0, transparent 42%), radial-gradient(circle at 88% 15%, rgba(249,115,22,0.12) 0, transparent 40%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/spotmyshot/spotMyShot_logo.png" alt="SpotMyShot" className="h-9 md:h-12 w-auto" />
              <span className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                {c.badge}
              </span>
              <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {c.heroTitle}
              </h1>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">{c.heroDesc}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 transition-opacity">
                  {c.ctaPrimary}
                </Link>
                <Link href="/spotmyshot" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                  {c.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-blue-200/40 to-orange-200/40 rounded-[2.5rem] blur-2xl" />
                <img src="/spotmyshot/spotMyShot_icon.png" alt="SpotMyShot" className="relative w-52 h-52 md:w-72 md:h-72 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Simulator ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-orange-600 font-semibold">
              <Icon path={ICONS.sliders} className="w-5 h-5" />
              SIMULATOR
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">{c.simTitle}</h2>
            <p className="mt-4 text-lg text-gray-600">{c.simDesc}</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden grid md:grid-cols-2">
            {/* Inputs */}
            <div className="p-8 space-y-7">
              <Slider
                label={c.simParticipants}
                value={participants} min={100} max={20000} step={100}
                onChange={setParticipants}
                display={`${nf.format(participants)}${c.unit}`}
              />
              <Slider
                label={c.simBuyRate}
                value={buyRate} min={5} max={80} step={1}
                onChange={setBuyRate}
                display={`${buyRate}%`}
              />
              <Slider
                label={c.simAvgSpend}
                value={avgSpend} min={isJa ? 300 : 3} max={isJa ? 6000 : 60} step={isJa ? 100 : 1}
                onChange={setAvgSpend}
                display={money(avgSpend)}
              />
              <Slider
                label={c.simOrgShare}
                value={orgShare} min={0} max={50} step={1}
                onChange={setOrgShare}
                display={`${orgShare}%`}
              />
            </div>

            {/* Results */}
            <div className="p-8 bg-gradient-to-br from-blue-600 to-orange-500 text-white flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-white/80 text-sm">{c.simBuyers}</p>
                <p className="text-2xl font-bold tabular-nums">{nf.format(buyers)}{c.unit}</p>
              </div>
              <div className="mb-6">
                <p className="text-white/80 text-sm">{c.simGross}</p>
                <p className="text-3xl font-extrabold tabular-nums">{money(gross)}</p>
              </div>
              <div className="pt-6 border-t border-white/25">
                <p className="text-white/90 text-sm">{c.simOrgRevenue}</p>
                <p className="text-4xl md:text-5xl font-extrabold tabular-nums leading-tight">{money(orgRevenue)}</p>
                <p className="text-white/70 text-xs mt-1">{c.simPerEvent}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">{c.simNote}</p>
        </div>
      </section>

      {/* ===== Benefits ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{c.benefitsTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {c.benefits.map((b, i) => (
              <div key={b.title} className="border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Icon path={ICONS[b.icon as keyof typeof ICONS]} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{b.title}</h3>
                <p className="text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">{c.ctaTitle}</h2>
          <p className="text-lg text-white/90 mb-9">{c.ctaDesc}</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-700 font-bold text-lg shadow-lg hover:bg-blue-50 transition-colors">
            {c.ctaButton}
          </Link>
        </div>
      </section>

      {/* ===== Cross-links ===== */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-gray-500">{isJa ? '他の方向け：' : 'For others:'}</span>
          <Link href="/spotmyshot/photographers" className="text-blue-600 font-semibold hover:underline">{isJa ? 'カメラマンの方へ →' : 'For Photographers →'}</Link>
          <Link href="/spotmyshot/participants" className="text-blue-600 font-semibold hover:underline">{isJa ? '参加者の方へ →' : 'For Participants →'}</Link>
          <Link href="/spotmyshot" className="text-gray-500 hover:underline">{isJa ? 'SpotMyShotトップ' : 'SpotMyShot home'}</Link>
        </div>
      </section>
    </div>
  )
}
