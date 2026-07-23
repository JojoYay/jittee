'use client'

import { useState } from 'react'
import Link from 'next/link'
import ImageModal from '../components/ImageModal'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * SpoSched (スポスケ) 紹介ページ — 1ページ・3言語 (ja/en/zh)。
 * コピーはこのページ内に閉じて持つ (locale で出し分け)。サイト共通の
 * LanguageSwitcher(Navbar) で言語が切り替わる。
 */

type Copy = {
  heroTagline: string
  heroDesc: string
  ctaPrimary: string
  problemsTitle: string
  problem1Title: string
  problem1Desc: string
  problem2Title: string
  problem2Desc: string
  solutionTitle: string
  solutionDesc: string
  feature1Title: string; feature1Desc: string
  feature2Title: string; feature2Desc: string
  feature3Title: string; feature3Desc: string
  feature4Title: string; feature4Desc: string
  screensTitle: string
  screenSchedule: string
  screenSettlement: string
  screenAccounting: string
  pricingTitle: string
  pricingFreeBadge: string
  pricingMonthly: string
  pricingPerMonth: string
  pricingYearlyLabel: string
  pricingYearly: string
  pricingYearlyNote: string
  pricingNote: string
  proofTitle: string
  proofDesc: string
  ctaTitle: string
  ctaDesc: string
  ctaButton: string
}

const COPY: Record<string, Copy> = {
  ja: {
    heroTagline: 'スポーツ団体の運営を、もっとシンプルに。',
    heroDesc: '出欠の確認から集金・会計まで。チーム運営の“面倒”を、ひとつのアプリに。',
    ctaPrimary: '3か月無料ではじめる',
    problemsTitle: 'スポーツ団体の運営、こんな悩みはありませんか？',
    problem1Title: '出欠確認が煩雑',
    problem1Desc: '「次はいつ・どこで、誰が来る？何人？」の確認が毎回大変。連絡がバラバラで、集計もひと苦労。',
    problem2Title: '会計・清算が煩雑',
    problem2Desc: '参加費の集金、誰が払った／未払い、団体に残っているお金…。手作業の管理は、手間もミスも増えがち。',
    solutionTitle: 'SpoSched なら、これらがまとめて解決',
    solutionDesc: '出欠・清算・会計・連絡を、ひとつの流れで。運営の手間を大きく減らします。',
    feature1Title: 'スケジュール & 出欠',
    feature1Desc: 'イベントを“いつ・どこで”登録。今“何人参加予定か”が一目で分かります。',
    feature2Title: '清算',
    feature2Desc: '“誰がいくら払う？”“支払い済み／未払い？”がすぐ分かる。イベントごとに自動で清算。',
    feature3Title: '会計',
    feature3Desc: '団体が“今いくらプールしているか”。残高と入出金の履歴をまとめて管理。',
    feature4Title: 'リマインド & 告知',
    feature4Desc: '未払いの催促や、参加の告知がかんたん。LINE連携でプッシュ通知も。',
    screensTitle: 'アプリ画面',
    screenSchedule: 'スケジュール',
    screenSettlement: '清算',
    screenAccounting: '会計',
    pricingTitle: '料金',
    pricingFreeBadge: '初回 3か月 無料',
    pricingMonthly: 'S$20',
    pricingPerMonth: '/ 月',
    pricingYearlyLabel: '年払い',
    pricingYearly: 'S$200 / 年',
    pricingYearlyNote: '2か月分お得',
    pricingNote: 'PayNow対応。まずは3か月無料でお試しください。',
    proofTitle: '導入実績',
    proofDesc: 'シンガポールのサッカーサークルを中心に、多くのチームにご利用いただいています。',
    ctaTitle: 'まずは3か月、無料で。',
    ctaDesc: '導入のご相談・お問い合わせはお気軽にどうぞ。',
    ctaButton: 'お問い合わせ',
  },
  en: {
    heroTagline: 'Running your sports club, made simple.',
    heroDesc: 'From attendance to collecting money and accounting — put the hassle of team management into one app.',
    ctaPrimary: 'Start 3 months free',
    problemsTitle: 'Managing a sports club? Sound familiar?',
    problem1Title: 'Attendance is a hassle',
    problem1Desc: '“When, where, who’s coming, how many?” — checking every time is tiring, and tallying scattered replies is even worse.',
    problem2Title: 'Accounting & settlement is a hassle',
    problem2Desc: 'Collecting fees, who paid and who hasn’t, how much the club has left… manual tracking means more work and more mistakes.',
    solutionTitle: 'SpoSched solves all of this',
    solutionDesc: 'Attendance, settlement, accounting and announcements in one flow — dramatically less admin work.',
    feature1Title: 'Schedule & Attendance',
    feature1Desc: 'Post an event with when & where. See at a glance how many people are coming.',
    feature2Title: 'Settlement',
    feature2Desc: 'Instantly see who owes how much and who’s paid or unpaid. Auto-settled per event.',
    feature3Title: 'Accounting',
    feature3Desc: 'Know exactly how much the club has pooled — balance and full transaction history in one place.',
    feature4Title: 'Reminders & Announcements',
    feature4Desc: 'Send payment reminders and event announcements easily — with push notifications via LINE.',
    screensTitle: 'App screens',
    screenSchedule: 'Schedule',
    screenSettlement: 'Settlement',
    screenAccounting: 'Accounting',
    pricingTitle: 'Pricing',
    pricingFreeBadge: 'First 3 months free',
    pricingMonthly: 'S$20',
    pricingPerMonth: '/ month',
    pricingYearlyLabel: 'Yearly',
    pricingYearly: 'S$200 / year',
    pricingYearlyNote: '2 months off',
    pricingNote: 'PayNow supported. Try it free for 3 months.',
    proofTitle: 'Trusted by teams',
    proofDesc: 'Used by many teams, especially soccer circles across Singapore.',
    ctaTitle: 'Try it free for 3 months.',
    ctaDesc: 'Get in touch — we’re happy to help you get started.',
    ctaButton: 'Contact us',
  },
  zh: {
    heroTagline: '让体育团体的运营，更简单。',
    heroDesc: '从考勤到收款、记账，把团队管理的“麻烦”都装进一个应用。',
    ctaPrimary: '免费试用 3 个月',
    problemsTitle: '运营体育团体，是否也有这些烦恼？',
    problem1Title: '考勤繁琐',
    problem1Desc: '“下次几点、在哪、谁来、几个人？”每次确认都很费劲，消息零散、统计更麻烦。',
    problem2Title: '记账与结算繁琐',
    problem2Desc: '收取参加费、谁付了／谁没付、团体还剩多少钱……手工管理既费时又容易出错。',
    solutionTitle: 'SpoSched 一次帮你解决',
    solutionDesc: '考勤、结算、记账、通知，一个流程搞定，大幅减少运营负担。',
    feature1Title: '日程与考勤',
    feature1Desc: '登记活动的时间与地点，一眼就能看到目前有多少人参加。',
    feature2Title: '结算',
    feature2Desc: '谁该付多少、是否已付，一目了然。按活动自动结算。',
    feature3Title: '记账',
    feature3Desc: '团体目前共有多少资金，余额与收支记录统一管理。',
    feature4Title: '提醒与通知',
    feature4Desc: '轻松发送催缴与活动通知，并可通过 LINE 推送。',
    screensTitle: '应用界面',
    screenSchedule: '日程',
    screenSettlement: '结算',
    screenAccounting: '记账',
    pricingTitle: '价格',
    pricingFreeBadge: '前 3 个月免费',
    pricingMonthly: 'S$20',
    pricingPerMonth: '/ 月',
    pricingYearlyLabel: '年付',
    pricingYearly: 'S$200 / 年',
    pricingYearlyNote: '省 2 个月',
    pricingNote: '支持 PayNow。先免费试用 3 个月。',
    proofTitle: '客户实绩',
    proofDesc: '以新加坡的足球社团为主，众多团队正在使用。',
    ctaTitle: '先免费试用 3 个月。',
    ctaDesc: '欢迎咨询，我们乐意协助您快速上手。',
    ctaButton: '联系我们',
  },
}

/** スマホ枠つきスクショ。画像が未配置でもラベル付きプレースホルダを出す */
function PhoneShot({ src, label, onOpen }: { src: string; label: string; onOpen: () => void }) {
  const [err, setErr] = useState(false)
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onOpen}
        className="rounded-[2rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform"
        style={{ width: 230 }}
        aria-label={label}
      >
        {err ? (
          <div className="bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center text-gray-400 text-sm" style={{ height: 470, width: 218 }}>
            {label}
          </div>
        ) : (
          <img src={src} alt={label} onError={() => setErr(true)} className="block w-full h-auto" />
        )}
      </button>
      <span className="mt-4 text-sm font-semibold text-gray-700">{label}</span>
    </div>
  )
}

export default function SpoSchedPage() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja
  const [modal, setModal] = useState<{ src: string; title: string } | null>(null)

  const shots = [
    { src: '/sposched/shot-schedule.png', label: c.screenSchedule },
    { src: '/sposched/shot-settlement.png', label: c.screenSettlement },
    { src: '/sposched/shot-accounting.png', label: c.screenAccounting },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-teal-500 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="bg-white/95 rounded-2xl shadow-xl inline-flex px-8 py-6 mb-8">
            <img src="/sposched/logo_sposched.png" alt="SpoSched" className="h-14 sm:h-20 w-auto" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow">{c.heroTagline}</h1>
          <p className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto mb-8">{c.heroDesc}</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-orange-50 transition-colors"
          >
            {c.ctaPrimary}
          </Link>
        </div>
      </section>

      {/* Problems */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.problemsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { t: c.problem1Title, d: c.problem1Desc },
            { t: c.problem2Title, d: c.problem2Desc },
          ].map((p, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 border-l-4 border-red-400">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">😵‍💫</span>
                <h3 className="text-lg font-bold text-gray-900">{p.t}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution / Features */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{c.solutionTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{c.solutionDesc}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: '📅', t: c.feature1Title, d: c.feature1Desc },
              { icon: '💳', t: c.feature2Title, d: c.feature2Desc },
              { icon: '📊', t: c.feature3Title, d: c.feature3Desc },
              { icon: '🔔', t: c.feature4Title, d: c.feature4Desc },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 flex gap-4">
                <div className="text-3xl">{f.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{f.t}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screens */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">{c.screensTitle}</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {shots.map((s) => (
            <PhoneShot key={s.src} src={s.src} label={s.label} onOpen={() => setModal({ src: s.src, title: s.label })} />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.pricingTitle}</h2>
          <div className="relative bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl shadow-lg p-8 text-center border border-orange-100">
            <span className="inline-block bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-6">
              🎁 {c.pricingFreeBadge}
            </span>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-5xl font-extrabold text-gray-900">{c.pricingMonthly}</span>
              <span className="text-xl text-gray-500 mb-1">{c.pricingPerMonth}</span>
            </div>
            <div className="text-gray-700 font-medium mb-6">
              {c.pricingYearlyLabel}: <span className="font-bold">{c.pricingYearly}</span>
              <span className="ml-2 inline-block bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {c.pricingYearlyNote}
              </span>
            </div>
            <p className="text-sm text-gray-500">{c.pricingNote}</p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{c.proofTitle}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">{c.proofDesc}</p>
        <div className="flex justify-center gap-3 text-4xl opacity-90">
          <span>⚽</span><span>🏀</span><span>🎾</span><span>⚾</span>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-500 to-orange-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.ctaTitle}</h2>
          <p className="text-white/95 mb-8">{c.ctaDesc}</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-teal-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-teal-50 transition-colors"
          >
            {c.ctaButton}
          </Link>
        </div>
      </section>

      <ImageModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        imageSrc={modal?.src ?? ''}
        imageAlt={modal?.title ?? ''}
        title={modal?.title ?? ''}
      />
    </div>
  )
}
