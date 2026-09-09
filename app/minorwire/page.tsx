'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { useLanguage } from '../contexts/LanguageContext'
import { useMinorWireStripeMode } from './StripeModeContext'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

const SUPPORT_MAIL = 'info@jittee.com'

/**
 * MinorWire marketing page — BYO Oracle Always Free + WireGuard toolkit.
 * Copy is closed inside this file (ja/en/zh) like /sposched.
 */

interface Copy {
  badge: string
  heroTitle: string
  heroDesc: string
  ctaApp: string
  ctaSetup: string
  ctaNote: string
  formTitle: string
  formDesc: string
  formPoints: string[]
  problemTitle: string
  problemDesc: string
  howTitle: string
  steps: { title: string; desc: string }[]
  pricingTitle: string
  planAppName: string
  planAppPrice: string
  planAppDesc: string
  planAppPoints: string[]
  planSetupName: string
  planSetupPrice: string
  planSetupDesc: string
  planSetupPoints: string[]
  needTitle: string
  needPoints: string[]
  faqTitle: string
  faqs: { q: string; a: string }[]
  finalTitle: string
  finalDesc: string
  paidAppTitle: string
  paidAppBody: string
  paidSetupTitle: string
  paidSetupBody: string
  paidMailCta: string
}

const COPY: Record<string, Copy> = {
  ja: {
    badge: 'Oracle Always Free × WireGuard',
    heroTitle: '自分の無料枠に、自分のVPNを。',
    heroDesc:
      'MinorWire はブラウザ上で OCI の最小権限キーを受け取り、あなたの Always Free 上に WireGuard を自動構築します。公式 WireGuard アプリ用の .conf をその場で渡せます。回線はあなたのもの。',
    ctaApp: 'セルフ S$10（PayNow）',
    ctaSetup: '一緒に設定 S$100（PayNow）',
    ctaNote: '決済は Stripe PayNow のみ。支払い後にセットアップ画面へ進みます（メールでも URL を送付）。',
    formTitle: 'いまの提供形態',
    formDesc:
      'ダウンロード型のアプリや CLI ZIP ではありません。支払い後の Web ウィザードに OCI キーを貼ると、jittee.com のサーバが構築を実行します。端末接続は公式 WireGuard アプリです。',
    formPoints: [
      '販売・構築 UI: jittee.com/minorwire',
      '支払い: Stripe PayNow（S$10 / S$100）',
      '実行場所: Firebase App Hosting（キーはジョブ中のみ・保存しない）',
      '接続用アプリ: 公式 WireGuard（Windows / Android / iOS / Mac）',
    ],
    problemTitle: 'VPNを売りたいわけではない',
    problemDesc:
      '帯域やサーバー台数をこちらで抱えるモデルではなく、顧客の Always Free 枠に最小構成を立て、端末用 config をハンディに作れる体験を商品にします。',
    howTitle: '使い方',
    steps: [
      {
        title: 'Oracle で最小権限の API キーを用意',
        desc: '画面のポリシーをコピペ。Tenancy / User / Compartment の OCID と PEM を用意します。',
      },
      {
        title: 'ブラウザに貼って作成',
        desc: '支払い後のウィザードでキーを送信。サーバが Micro と WireGuard を立てます。',
      },
      {
        title: '端末に config を入れる',
        desc: '表示された .conf を公式 WireGuard に入れます。追加端末用の .conf も同じ画面から何度でも作れます。',
      },
    ],
    pricingTitle: '料金（買い切り・SGD）',
    planAppName: 'セルフセットアップ',
    planAppPrice: 'S$10',
    planAppDesc: 'Web ウィザードで自分でキー投入〜構築まで進める方向け。',
    planAppPoints: [
      'ブラウザ完結のプロビジョン',
      '最小 IAM ポリシー案内',
      'OCI サーバ構築は購入ごとに1回',
      '端末 .conf は追加発行可',
    ],
    planSetupName: 'サポート付きセットアップ',
    planSetupPrice: 'S$100',
    planSetupDesc: '画面共有で、キー作成から最初の接続まで一緒に完了。',
    planSetupPoints: [
      'セルフ機能込み',
      'ライブサポート（目安60分）',
      'VPN 起動確認',
      '複数端末の .conf 作成を一緒に',
    ],
    needTitle: '必要なもの',
    needPoints: [
      'Oracle Cloud アカウント（Always Free が使えること）',
      'ホームリージョンで Micro 枠に空きがあること',
      '専用ユーザーの API キー（フル権限共有は不要）',
    ],
    faqTitle: 'FAQ',
    faqs: [
      {
        q: 'アプリや ZIP をダウンロードしますか？',
        a: 'いいえ。支払い後の Web ウィザードで完結します。接続には公式 WireGuard アプリを使います。',
      },
      {
        q: 'API キーは保存されますか？',
        a: 'お客様の OCI API キーは構築中だけ使い、永続保存しません。端末 .conf 追加用に、インスタンス SSH 鍵だけ暗号化して保持します。',
      },
      {
        q: '月額のVPN利用料はありますか？',
        a: 'ありません。Stripe はツール代と、希望者向けのセットアップ代のみです。通信はお客様の OCI 上で完結します。',
      },
      {
        q: '何台まで繋がりますか？',
        a: '購入1回あたり OCI 上のサーバ構築は1回です。.conf は端末ごとに何度でも追加できます。同時利用の現実目安は Micro で数台〜十台前後です。',
      },
    ],
    finalTitle: 'まずはサポート付きからでも、セルフからでも。',
    finalDesc: 'PayNow のあと、セットアップウィザードで構築できます。',
    paidAppTitle: 'お支払いありがとうございます（セルフ）',
    paidAppBody: 'セットアップウィザードへ進んでください。メールにも同じ URL を送っています。',
    paidSetupTitle: 'お支払いありがとうございます（サポート付き）',
    paidSetupBody:
      'ウィザードで構築を進めつつ、日程は info@jittee.com までご連絡ください。',
    paidMailCta: 'メールで連絡する',
  },
  en: {
    badge: 'Oracle Always Free × WireGuard',
    heroTitle: 'Your free tier. Your VPN.',
    heroDesc:
      'MinorWire takes a least-privilege OCI API key in the browser and provisions WireGuard on your Always Free tenancy. You get a .conf for the official WireGuard apps. You keep the pipe.',
    ctaApp: 'Self-serve S$10 (PayNow)',
    ctaSetup: 'Assisted setup S$100 (PayNow)',
    ctaNote: 'Stripe PayNow only. After payment you open the setup wizard (URL also emailed).',
    formTitle: 'What you get',
    formDesc:
      'Not a downloadable app or CLI ZIP. After payment, paste OCI credentials into a web wizard; jittee.com runs the provisioner. Devices use official WireGuard.',
    formPoints: [
      'Sales + setup UI: jittee.com/minorwire',
      'Payment: Stripe PayNow (S$10 / S$100)',
      'Runs on Firebase App Hosting (keys used in-memory for the job only)',
      'Clients: official WireGuard (Windows / Android / iOS / Mac)',
    ],
    problemTitle: 'We are not selling bandwidth',
    problemDesc:
      'Instead of hosting VPN capacity ourselves, we install a minimal stack on the customer Always Free allowance and make device configs easy to mint.',
    howTitle: 'How it works',
    steps: [
      {
        title: 'Create a least-privilege API key',
        desc: 'Copy the on-screen IAM policy. Collect tenancy / user / compartment OCIDs and the PEM.',
      },
      {
        title: 'Paste into the wizard',
        desc: 'After payment, submit credentials. Our server creates Micro + WireGuard.',
      },
      {
        title: 'Import the config',
        desc: 'Download the .conf into official WireGuard. Mint more device .conf files anytime from the same screen.',
      },
    ],
    pricingTitle: 'Pricing (one-time, SGD)',
    planAppName: 'Self-serve',
    planAppPrice: 'S$10',
    planAppDesc: 'Web wizard for customers who complete IAM and provision alone.',
    planAppPoints: [
      'Browser-based provision',
      'Least-privilege IAM guide',
      'One OCI server per purchase',
      'Unlimited extra device .conf',
    ],
    planSetupName: 'Assisted setup',
    planSetupPrice: 'S$100',
    planSetupDesc: 'Screen-share through key creation to first successful connect.',
    planSetupPoints: [
      'Includes self-serve flow',
      'Live help (~60 min)',
      'VPN bring-up check',
      'Help adding multiple device .conf',
    ],
    needTitle: 'What you need',
    needPoints: [
      'An Oracle Cloud account with Always Free eligibility',
      'Spare Micro capacity in your home region',
      'A dedicated API user (full tenancy admin share not required)',
    ],
    faqTitle: 'FAQ',
    faqs: [
      {
        q: 'Do I download an app or ZIP?',
        a: 'No. Setup is a web wizard after payment. Connections use the official WireGuard apps.',
      },
      {
        q: 'Do you store my API key?',
        a: 'Customer OCI API keys are used in memory only and not persisted. An encrypted instance SSH key is kept so you can add more device .conf files later.',
      },
      {
        q: 'Is there a monthly VPN fee?',
        a: 'No. Stripe charges the tool fee and optional assisted setup only. Traffic stays on your OCI instance.',
      },
      {
        q: 'How many devices can connect?',
        a: 'One OCI server provision per purchase. Device .conf files can be added anytime. Concurrent use on Always Free Micro is realistically a handful to ~10 light users.',
      },
    ],
    finalTitle: 'Start assisted or self-serve.',
    finalDesc: 'After PayNow, continue in the setup wizard.',
    paidAppTitle: 'Thanks for your payment (self-serve)',
    paidAppBody: 'Continue to the setup wizard. The same URL is emailed.',
    paidSetupTitle: 'Thanks for your payment (assisted)',
    paidSetupBody: 'Use the wizard, and email info@jittee.com to schedule screen-share.',
    paidMailCta: 'Email us',
  },
  zh: {
    badge: 'Oracle Always Free × WireGuard',
    heroTitle: '用你的免费额度，搭你的 VPN。',
    heroDesc:
      'MinorWire 在浏览器中接收最小权限 OCI API 密钥，并在你的 Always Free 上自动部署 WireGuard，当场给出官方 WireGuard 用的 .conf。线路属于你。',
    ctaApp: '自助 S$10（PayNow）',
    ctaSetup: '协助安装 S$100（PayNow）',
    ctaNote: '仅支持 Stripe PayNow。付款后进入安装向导（邮件也会发送链接）。',
    formTitle: '现在的提供形态',
    formDesc:
      '不是可下载应用或 CLI ZIP。付款后在网页向导粘贴 OCI 密钥，由 jittee.com 服务器执行部署。设备连接使用官方 WireGuard。',
    formPoints: [
      '销售与安装 UI：jittee.com/minorwire',
      '支付：Stripe PayNow（S$10 / S$100）',
      '运行于 Firebase App Hosting（密钥仅在任务内存中使用）',
      '客户端：官方 WireGuard（Windows / Android / iOS / Mac）',
    ],
    problemTitle: '我们不卖带宽',
    problemDesc:
      '不在我们这边堆服务器，而是在客户的 Always Free 上搭建最小环境，并把各设备配置做得足够好用。',
    howTitle: '使用方式',
    steps: [
      {
        title: '创建最小权限 API 密钥',
        desc: '复制页面内 IAM 策略，准备 Tenancy / User / Compartment OCID 与 PEM。',
      },
      {
        title: '粘贴到向导并创建',
        desc: '付款后提交密钥。服务器创建 Micro 与 WireGuard。',
      },
      {
        title: '导入配置',
        desc: '下载 .conf 并导入官方 WireGuard。同一页面可随时再生成更多设备 .conf。',
      },
    ],
    pricingTitle: '价格（一次性 · SGD）',
    planAppName: '自助安装',
    planAppPrice: 'S$10',
    planAppDesc: '网页向导，适合自行完成 IAM 与部署的用户。',
    planAppPoints: [
      '浏览器完成部署',
      '最小权限 IAM 指南',
      '每次购买仅搭建一次 OCI 服务器',
      '设备 .conf 可反复追加',
    ],
    planSetupName: '协助安装',
    planSetupPrice: 'S$100',
    planSetupDesc: '远程协助，从密钥创建到首次连通。',
    planSetupPoints: ['含自助流程', '在线协助（约60分钟）', 'VPN 启动确认', '一起添加多台设备 .conf'],
    needTitle: '你需要准备',
    needPoints: [
      '可使用 Always Free 的 Oracle Cloud 账号',
      '家庭区域仍有 Micro 名额',
      '专用 API 用户（无需共享完整管理员账号）',
    ],
    faqTitle: '常见问题',
    faqs: [
      {
        q: '需要下载应用或 ZIP 吗？',
        a: '不需要。付款后用网页向导即可。连接使用官方 WireGuard。',
      },
      {
        q: '会保存我的 API 密钥吗？',
        a: '客户的 OCI API 密钥只在部署时使用，不会持久保存。为追加设备 .conf，仅加密保存实例 SSH 密钥。',
      },
      {
        q: '有没有按月的 VPN 费用？',
        a: '没有。Stripe 只收工具费和可选的协助安装费。流量走你自己的 OCI。',
      },
      {
        q: '可以连多少台设备？',
        a: '每次购买只搭建一次 OCI 服务器。.conf 可随时追加。Always Free Micro 同时在线更现实的是数台到约10台轻度使用。',
      },
    ],
    finalTitle: '可先协助安装，也可自助开始。',
    finalDesc: 'PayNow 之后在安装向导中继续。',
    paidAppTitle: '感谢付款（自助）',
    paidAppBody: '请继续打开安装向导。邮件中也有同样的链接。',
    paidSetupTitle: '感谢付款（协助安装）',
    paidSetupBody: '请使用向导，并邮件联系 info@jittee.com 安排远程协助。',
    paidMailCta: '发邮件',
  },
}

function PaidBanner({ c }: { c: Copy }) {
  const params = useSearchParams()
  const paid = params.get('paid')
  if (paid !== 'app' && paid !== 'setup') return null

  const title = paid === 'app' ? c.paidAppTitle : c.paidSetupTitle
  const body = paid === 'app' ? c.paidAppBody : c.paidSetupBody
  const subject =
    paid === 'app' ? 'MinorWire self-serve purchase' : 'MinorWire assisted setup purchase'

  return (
    <div className="relative z-10 border-b border-[#2f6b4f]/30 bg-[#1d3d2e] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className={`${syne.className} font-bold text-lg`}>{title}</p>
          <p className="mt-1 text-sm text-[#cfe7da] leading-relaxed">{body}</p>
        </div>
        <a
          href={`mailto:${SUPPORT_MAIL}?subject=${encodeURIComponent(subject)}`}
          className="inline-flex justify-center px-5 py-2.5 rounded-md bg-white text-[#1d3d2e] font-semibold shrink-0"
        >
          {c.paidMailCta}
        </a>
      </div>
    </div>
  )
}

function MinorWireContent() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja
  const { mode, setMode, links, isTest } = useMinorWireStripeMode()

  return (
    <div className={`${dmSans.className} bg-[#f3f6f4] text-[#14201a]`}>
      <Suspense fallback={null}>
        <PaidBanner c={c} />
      </Suspense>

      {isTest && (
        <div className="relative z-10 border-b border-amber-700/40 bg-amber-50 text-amber-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
            <p>
              Stripe <strong>test mode</strong> — use card{' '}
              <span className="font-mono">4242 4242 4242 4242</span> (any future expiry / CVC). No
              real charge. PayNow is live-only.
            </p>
            <button
              type="button"
              onClick={() => setMode('live')}
              className="underline font-semibold shrink-0 text-left"
            >
              Switch to live
            </button>
          </div>
        </div>
      )}

      <section className="relative min-h-[88vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, #9fd6b8 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 10% 80%, #cfe7da 0%, transparent 50%), linear-gradient(160deg, #e8f2ec 0%, #f7faf8 45%, #d9ebe2 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,32,26,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,32,26,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f]">
              {c.badge}
            </p>
            <div
              className="inline-flex rounded-md border border-[#1d3d2e]/20 bg-white/80 text-xs font-semibold overflow-hidden"
              role="group"
              aria-label="Stripe mode"
            >
              <button
                type="button"
                onClick={() => setMode('live')}
                className={`px-3 py-1.5 ${mode === 'live' ? 'bg-[#1d3d2e] text-white' : 'text-[#3a4f44]'}`}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => setMode('test')}
                className={`px-3 py-1.5 ${mode === 'test' ? 'bg-amber-700 text-white' : 'text-[#3a4f44]'}`}
              >
                Test
              </button>
            </div>
          </div>
          <h1
            className={`${syne.className} text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight max-w-4xl`}
          >
            MinorWire
          </h1>
          <p className={`${syne.className} mt-6 text-2xl sm:text-3xl font-semibold text-[#1d3d2e] max-w-2xl`}>
            {c.heroTitle}
          </p>
          <p className="mt-5 text-lg text-[#3a4f44] max-w-xl leading-relaxed">{c.heroDesc}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={links.app}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
            >
              {c.ctaApp}
            </a>
            <a
              href={links.setup}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md border border-[#1d3d2e]/30 bg-white/70 backdrop-blur font-semibold hover:bg-white transition-colors"
            >
              {c.ctaSetup}
            </a>
          </div>
          <p className="mt-4 text-sm text-[#5a6f64]">
            {isTest
              ? 'Test checkout (card). After pay, continue to the setup wizard with a cs_test_ session.'
              : c.ctaNote}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.formTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-6">{c.formDesc}</p>
        <ul className="space-y-3 text-[#3a4f44] max-w-3xl">
          {c.formPoints.map((p) => (
            <li key={p} className="border-l-2 border-[#7dba98] pl-4">
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.problemTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed">{c.problemDesc}</p>
      </section>

      <section className="bg-[#14201a] text-[#e8f2ec] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`${syne.className} text-3xl font-bold mb-12`}>{c.howTitle}</h2>
          <ol className="grid md:grid-cols-3 gap-10">
            {c.steps.map((step, i) => (
              <li key={step.title}>
                <p className={`${syne.className} text-5xl font-bold text-[#7dba98] mb-4`}>{i + 1}</p>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[#b7c9be] leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`${syne.className} text-3xl font-bold mb-10`}>{c.pricingTitle}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-[#1d3d2e]/15 bg-white/80 p-8">
            <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-medium">{c.planAppName}</p>
            <p className={`${syne.className} text-5xl font-bold mt-2`}>{c.planAppPrice}</p>
            <p className="mt-3 text-[#3a4f44]">{c.planAppDesc}</p>
            <ul className="mt-6 space-y-2 text-[#3a4f44]">
              {c.planAppPoints.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-[#2f6b4f]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={links.app}
              className="mt-8 inline-flex px-5 py-3 bg-[#1d3d2e] text-white font-semibold rounded-md hover:bg-[#14201a] transition-colors"
            >
              {c.ctaApp}
            </a>
          </div>
          <div className="border border-[#1d3d2e]/25 bg-[#1d3d2e] text-white p-8">
            <p className="text-sm uppercase tracking-wider text-[#9fd6b8] font-medium">{c.planSetupName}</p>
            <p className={`${syne.className} text-5xl font-bold mt-2`}>{c.planSetupPrice}</p>
            <p className="mt-3 text-[#cfe7da]">{c.planSetupDesc}</p>
            <ul className="mt-6 space-y-2 text-[#e8f2ec]">
              {c.planSetupPoints.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-[#9fd6b8]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={links.setup}
              className="mt-8 inline-flex px-5 py-3 bg-white text-[#1d3d2e] font-semibold rounded-md hover:bg-[#e8f2ec] transition-colors"
            >
              {c.ctaSetup}
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className={`${syne.className} text-3xl font-bold mb-6`}>{c.needTitle}</h2>
        <ul className="space-y-3 text-[#3a4f44] text-lg max-w-3xl">
          {c.needPoints.map((p) => (
            <li key={p} className="border-l-2 border-[#7dba98] pl-4">
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`${syne.className} text-3xl font-bold mb-8`}>{c.faqTitle}</h2>
        <div className="space-y-8 max-w-3xl">
          {c.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-lg mb-2">{f.q}</h3>
              <p className="text-[#3a4f44] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#1d3d2e]/10 bg-white/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.finalTitle}</h2>
          <p className="text-[#3a4f44] mb-8">{c.finalDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={links.app}
              className="inline-flex justify-center px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
            >
              {c.ctaApp}
            </a>
            <a
              href={links.setup}
              className="inline-flex justify-center px-6 py-3.5 rounded-md border border-[#1d3d2e]/30 font-semibold hover:bg-white transition-colors"
            >
              {c.ctaSetup}
            </a>
          </div>
          <p className="mt-6 text-sm text-[#5a6f64]">
            <Link href="/contact" className="underline">
              Contact
            </Link>
            {' · '}
            <button type="button" className="underline" onClick={() => setMode(isTest ? 'live' : 'test')}>
              Stripe: {mode}
            </button>
          </p>
        </div>
      </section>
    </div>
  )
}

export default function MinorWirePage() {
  return (
    <Suspense fallback={null}>
      <MinorWireContent />
    </Suspense>
  )
}
