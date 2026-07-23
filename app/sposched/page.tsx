'use client'

import { useState } from 'react'
import Link from 'next/link'
import ImageModal from '../components/ImageModal'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * SpoSched (スポスケ) 紹介ページ — 1ページ・3言語 (ja/en/zh)。
 * コピーはこのページ内に閉じて持つ (locale で出し分け)。サイト共通の
 * LanguageSwitcher(Navbar) で言語が切り替わる。実スクショは public/sposched/。
 */

interface Feature {
  title: string
  desc: string
  bullets: string[]
  shots: { src: string; label: string }[]
  comingSoon?: string // 近日提供バッジ (スクショ無しの装飾表示)
}
interface Copy {
  heroTagline: string
  heroDesc: string
  ctaPrimary: string
  problemsTitle: string
  problem1Title: string; problem1Desc: string
  problem2Title: string; problem2Desc: string
  solutionTitle: string; solutionDesc: string
  featuresTitle: string
  features: Feature[]
  pricingTitle: string
  pricingFreeBadge: string
  pricingMonthly: string; pricingPerMonth: string
  pricingYearlyLabel: string; pricingYearly: string; pricingYearlyNote: string
  pricingNote: string
  proofTitle: string; proofDesc: string
  ctaTitle: string; ctaDesc: string; ctaButton: string
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
    featuresTitle: 'できること',
    features: [
      {
        title: 'スケジュール & 出欠',
        desc: 'イベントを“いつ・どこで”登録。今“何人参加予定か”が一目で分かります。',
        bullets: ['カレンダーで開催日・場所を共有', '〇△×で出欠回答、参加人数を自動集計', '定員・残席もひと目で把握'],
        shots: [{ src: '/sposched/calendar.png', label: 'カレンダー' }, { src: '/sposched/calendar2.png', label: '出欠一覧' }],
      },
      {
        title: '清算（割り勘）',
        desc: '“誰がいくら払う？”“支払い済み／未払い？”がすぐ分かる。イベントごとに自動で清算。',
        bullets: ['参加費をイベントごとに自動で割り勘', '支払済／未払いが一覧でわかる', 'メンバーはPayNowで支払い→スクショで完了'],
        shots: [{ src: '/sposched/PaymentTable.png', label: '幹事の清算画面' }, { src: '/sposched/payment.png', label: 'メンバーの支払い' }],
      },
      {
        title: '会計',
        desc: '団体が“今いくらプールしているか”。残高と入出金の履歴をまとめて管理。',
        bullets: ['入金・支出を記録して残高を自動計算', '清算の入金も自動で会計に反映', '団体のプール金額がいつでも分かる'],
        shots: [{ src: '/sposched/Cashbook.png', label: '会計（台帳）' }],
      },
      {
        title: 'LINE連携 & リマインド',
        desc: '未払いの催促や、参加の告知がかんたん。LINE公式アカウントと連携できます。',
        bullets: ['公式アカウントを友だち追加するだけで登録完了', '未払いの催促・イベント告知をLINEでプッシュ', 'リッチメニューからアプリへすぐアクセス'],
        shots: [{ src: '/sposched/line-setting.png', label: 'LINE設定' }],
      },
      {
        title: '写真・動画の共有',
        desc: '試合や練習の写真・動画をアップロードして、チームで共有・ダウンロードできます。',
        bullets: ['イベントごとのアルバムを自動作成', 'メンバーがアップロード、リンクを知っていれば誰でも閲覧・ダウンロード', '有料プランなら100GBまで無料'],
        shots: [],
        comingSoon: '近日提供',
      },
    ],
    pricingTitle: '料金',
    pricingFreeBadge: '初回 3か月 無料',
    pricingMonthly: 'S$20', pricingPerMonth: '/ 月',
    pricingYearlyLabel: '年払い', pricingYearly: 'S$200 / 年', pricingYearlyNote: '2か月分お得',
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
    featuresTitle: 'What you can do',
    features: [
      {
        title: 'Schedule & Attendance',
        desc: 'Post an event with when & where. See at a glance how many people are coming.',
        bullets: ['Share dates & venues on a shared calendar', 'RSVP with ○ △ ✕; headcount tallied automatically', 'See capacity and spots left instantly'],
        shots: [{ src: '/sposched/calendar.png', label: 'Calendar' }, { src: '/sposched/calendar2.png', label: 'Attendance list' }],
      },
      {
        title: 'Settlement (split the bill)',
        desc: 'Instantly see who owes how much and who’s paid or unpaid. Auto-settled per event.',
        bullets: ['Fees split automatically per event', 'See paid / unpaid at a glance', 'Members pay via PayNow → upload a screenshot to finish'],
        shots: [{ src: '/sposched/PaymentTable.png', label: 'Organizer view' }, { src: '/sposched/payment.png', label: 'Member payment' }],
      },
      {
        title: 'Accounting',
        desc: 'Know exactly how much the club has pooled — balance and full history in one place.',
        bullets: ['Record income & expenses; balance auto-calculated', 'Settlement income flows into the ledger automatically', 'Always know the club’s pooled balance'],
        shots: [{ src: '/sposched/Cashbook.png', label: 'Ledger' }],
      },
      {
        title: 'LINE integration & reminders',
        desc: 'Send payment reminders and event announcements easily — connect your official LINE account.',
        bullets: ['Members register just by adding your official account', 'Push payment reminders & announcements via LINE', 'Quick access to the app from the rich menu'],
        shots: [{ src: '/sposched/line-setting.png', label: 'LINE settings' }],
      },
      {
        title: 'Photo & video sharing',
        desc: 'Upload photos and videos from matches and practices, and share/download them as a team.',
        bullets: ['Albums created automatically per event', 'Members upload; anyone with the link can view & download', '100GB included free with the paid plan'],
        shots: [],
        comingSoon: 'Coming soon',
      },
    ],
    pricingTitle: 'Pricing',
    pricingFreeBadge: 'First 3 months free',
    pricingMonthly: 'S$20', pricingPerMonth: '/ month',
    pricingYearlyLabel: 'Yearly', pricingYearly: 'S$200 / year', pricingYearlyNote: '2 months off',
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
    featuresTitle: '功能一览',
    features: [
      {
        title: '日程与考勤',
        desc: '登记活动的时间与地点，一眼就能看到目前有多少人参加。',
        bullets: ['用共享日历同步日期与场地', '以 ○ △ ✕ 回答出席，自动统计人数', '名额与剩余席位一目了然'],
        shots: [{ src: '/sposched/calendar.png', label: '日历' }, { src: '/sposched/calendar2.png', label: '出席名单' }],
      },
      {
        title: '结算（分摊）',
        desc: '谁该付多少、是否已付，一目了然。按活动自动结算。',
        bullets: ['按活动自动分摊参加费', '已付／未付一览无余', '成员用 PayNow 付款 → 上传截图即完成'],
        shots: [{ src: '/sposched/PaymentTable.png', label: '干事结算界面' }, { src: '/sposched/payment.png', label: '成员付款' }],
      },
      {
        title: '记账',
        desc: '团体目前共有多少资金，余额与收支记录统一管理。',
        bullets: ['记录收入与支出，自动计算余额', '结算收入自动计入账本', '随时掌握团体的资金余额'],
        shots: [{ src: '/sposched/Cashbook.png', label: '账本' }],
      },
      {
        title: 'LINE 联动与提醒',
        desc: '轻松发送催缴与活动通知，可与 LINE 官方账号联动。',
        bullets: ['加官方账号为好友即可完成注册', '通过 LINE 推送催缴与活动通知', '从丰富菜单快速进入应用'],
        shots: [{ src: '/sposched/line-setting.png', label: 'LINE 设置' }],
      },
      {
        title: '照片与视频共享',
        desc: '上传比赛和训练的照片与视频，团队共享、随时下载。',
        bullets: ['按活动自动创建相册', '成员上传，知道链接的人即可查看与下载', '付费方案免费提供 100GB'],
        shots: [],
        comingSoon: '即将推出',
      },
    ],
    pricingTitle: '价格',
    pricingFreeBadge: '前 3 个月免费',
    pricingMonthly: 'S$20', pricingPerMonth: '/ 月',
    pricingYearlyLabel: '年付', pricingYearly: 'S$200 / 年', pricingYearlyNote: '省 2 个月',
    pricingNote: '支持 PayNow。先免费试用 3 个月。',
    proofTitle: '客户实绩',
    proofDesc: '以新加坡的足球社团为主，众多团队正在使用。',
    ctaTitle: '先免费试用 3 个月。',
    ctaDesc: '欢迎咨询，我们乐意协助您快速上手。',
    ctaButton: '联系我们',
  },
}

/** スマホ枠つきスクショ。画像未配置でもラベル付きプレースホルダを出す */
function PhoneShot({ src, label, onOpen }: { src: string; label: string; onOpen: () => void }) {
  const [err, setErr] = useState(false)
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onOpen}
        className="rounded-[2rem] border-[6px] border-gray-800 bg-gray-800 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform"
        style={{ width: 210 }}
        aria-label={label}
      >
        {err ? (
          <div className="bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center text-gray-400 text-sm" style={{ height: 430, width: 198 }}>
            {label}
          </div>
        ) : (
          <img src={src} alt={label} onError={() => setErr(true)} className="block w-full h-auto" />
        )}
      </button>
      <span className="mt-3 text-xs font-semibold text-gray-500">{label}</span>
    </div>
  )
}

export default function SpoSchedPage() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja
  const [modal, setModal] = useState<{ src: string; title: string } | null>(null)

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
          <Link href="/contact" className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-orange-50 transition-colors">
            {c.ctaPrimary}
          </Link>
        </div>
      </section>

      {/* Problems */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.problemsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[{ t: c.problem1Title, d: c.problem1Desc }, { t: c.problem2Title, d: c.problem2Desc }].map((p, i) => (
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

      {/* Solution intro */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{c.solutionTitle}</h2>
          <p className="text-gray-600">{c.solutionDesc}</p>
        </div>
      </section>

      {/* Feature sections with real screenshots (alternating) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="sr-only">{c.featuresTitle}</h2>
        <div className="space-y-16 sm:space-y-24 py-10">
          {c.features.map((f, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10`}>
              {/* Screenshots (無ければ装飾ボックス) */}
              <div className="flex justify-center gap-6 flex-1">
                {f.shots.length > 0 ? f.shots.map((s) => (
                  <PhoneShot key={s.src} src={s.src} label={s.label} onOpen={() => setModal({ src: s.src, title: s.label })} />
                )) : (
                  <div className="rounded-[2rem] bg-gradient-to-br from-orange-100 to-teal-100 shadow-inner flex flex-col items-center justify-center gap-3"
                    style={{ width: 210, height: 430 }}>
                    <span className="text-5xl">📸</span>
                    <span className="text-5xl">🎥</span>
                  </div>
                )}
              </div>
              {/* Text */}
              <div className="flex-1">
                <div className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                {f.comingSoon && (
                  <span className="ml-2 inline-block bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {f.comingSoon}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b, j) => (
                    <li key={j} className="flex items-start text-gray-700">
                      <span className="text-teal-500 mr-2 mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">{c.pricingTitle}</h2>
          <div className="relative bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl shadow-lg p-8 text-center border border-orange-100">
            <span className="inline-block bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-6">🎁 {c.pricingFreeBadge}</span>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-5xl font-extrabold text-gray-900">{c.pricingMonthly}</span>
              <span className="text-xl text-gray-500 mb-1">{c.pricingPerMonth}</span>
            </div>
            <div className="text-gray-700 font-medium mb-6">
              {c.pricingYearlyLabel}: <span className="font-bold">{c.pricingYearly}</span>
              <span className="ml-2 inline-block bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">{c.pricingYearlyNote}</span>
            </div>
            <p className="text-sm text-gray-500">{c.pricingNote}</p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{c.proofTitle}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">{c.proofDesc}</p>
        <div className="flex justify-center gap-3 text-4xl opacity-90"><span>⚽</span><span>🏀</span><span>🎾</span><span>⚾</span></div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-500 to-orange-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.ctaTitle}</h2>
          <p className="text-white/95 mb-8">{c.ctaDesc}</p>
          <Link href="/contact" className="inline-block bg-white text-teal-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-teal-50 transition-colors">
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
