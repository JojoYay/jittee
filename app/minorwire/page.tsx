'use client'

import Link from 'next/link'
import { Syne, DM_Sans } from 'next/font/google'
import { useLanguage } from '../contexts/LanguageContext'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

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
  ctaSoon: string
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
}

const COPY: Record<string, Copy> = {
  ja: {
    badge: 'Oracle Always Free × WireGuard',
    heroTitle: '自分の無料枠に、自分のVPNを。',
    heroDesc:
      'MinorWire は、あなたの Oracle Cloud 上に WireGuard を自動構築し、Windows / Android / iOS / Mac 用の設定をアプリから発行します。回線はあなたのもの。私たちはセットアップと管理ツールを提供します。',
    ctaApp: 'アプリ $10（準備中）',
    ctaSetup: '一緒に設定 $100',
    ctaSoon: 'Stripe 決済は準備中です。サポート付きはお問い合わせください。',
    problemTitle: 'VPNを売りたいわけではない',
    problemDesc:
      '帯域やサーバー台数をこちらで抱えるモデルではなく、顧客の Always Free 枠に最小構成を立て、端末用 config をハンディに作れる体験を商品にします。',
    howTitle: '使い方',
    steps: [
      {
        title: 'Oracle で最小権限の API キーを用意',
        desc: 'アプリ内のポリシーをコピペ。Tenancy / User / Compartment の OCID と秘密鍵を用意します。',
      },
      {
        title: 'アプリに貼って「作成」',
        desc: 'Micro インスタンスと公開到達可能な WireGuard を自動で立てます。',
      },
      {
        title: '端末ごとに config を発行',
        desc: 'Windows / Android / iOS / Mac 向けにピアを追加し、QR またはファイルで渡します。',
      },
    ],
    pricingTitle: '料金（買い切り）',
    planAppName: 'セルフセットアップ',
    planAppPrice: '$10',
    planAppDesc: 'アプリ代。キー作成から構築まで自分で進める方向け。',
    planAppPoints: [
      'アプリライセンス',
      '最小 IAM ポリシーと手順',
      '自動プロビジョン',
      '端末 config / QR 発行',
    ],
    planSetupName: 'サポート付きセットアップ',
    planSetupPrice: '$100',
    planSetupDesc: '画面共有で、キー作成から最初の接続まで一緒に完了。',
    planSetupPoints: [
      'アプリ込み',
      'ライブサポート（目安60分）',
      'VPN 起動確認',
      '端末設定 最大2台まで',
    ],
    needTitle: '必要なもの',
    needPoints: [
      'Oracle Cloud アカウント（Always Free が使えること）',
      'ホームリージョンで Micro 枠に空きがあること',
      'アプリに渡す専用ユーザーの API キー（フル権限共有は不要）',
    ],
    faqTitle: 'FAQ',
    faqs: [
      {
        q: '月額のVPN利用料はありますか？',
        a: 'MVPではありません。Stripe はアプリ代と、希望者向けのセットアップ代のみです。通信はお客様の OCI 上で完結します。',
      },
      {
        q: '何台まで繋がりますか？',
        a: '登録ピアは多数作れますが、Always Free の Micro（1/8 OCPU・1GB）では同時利用は数台〜十台前後が現実的です。',
      },
      {
        q: 'アカウント全体を共有する必要はありますか？',
        a: 'ありません。Compute / Networking など最小権限の専用ユーザーと API キーだけで進めます。',
      },
    ],
    finalTitle: 'まずはサポート付きからでも、セルフからでも。',
    finalDesc: '製品と決済の準備が進み次第、このページで $10 の購入を開放します。',
  },
  en: {
    badge: 'Oracle Always Free × WireGuard',
    heroTitle: 'Your free tier. Your VPN.',
    heroDesc:
      'MinorWire provisions WireGuard on your Oracle Cloud Always Free tenancy and issues Windows / Android / iOS / Mac configs from a small app. You keep the pipe — we sell setup and management.',
    ctaApp: 'App $10 (coming soon)',
    ctaSetup: 'Assisted setup $100',
    ctaSoon: 'Stripe checkout is being prepared. Contact us for assisted setup.',
    problemTitle: 'We are not selling bandwidth',
    problemDesc:
      'Instead of hosting VPN capacity ourselves, we install a minimal stack on the customer Always Free allowance and make device configs easy to mint.',
    howTitle: 'How it works',
    steps: [
      {
        title: 'Create a least-privilege API key',
        desc: 'Copy the in-app IAM policy. Collect tenancy / user / compartment OCIDs and the private key.',
      },
      {
        title: 'Paste into the app and provision',
        desc: 'Creates a Micro instance and an internet-reachable WireGuard endpoint.',
      },
      {
        title: 'Issue per-device configs',
        desc: 'Add peers for Windows / Android / iOS / Mac via QR or file.',
      },
    ],
    pricingTitle: 'Pricing (one-time)',
    planAppName: 'Self-serve',
    planAppPrice: '$10',
    planAppDesc: 'App license for customers who complete IAM and provision alone.',
    planAppPoints: [
      'App license',
      'Least-privilege IAM guide',
      'Auto provision',
      'Device config / QR',
    ],
    planSetupName: 'Assisted setup',
    planSetupPrice: '$100',
    planSetupDesc: 'Screen-share through key creation to first successful connect.',
    planSetupPoints: [
      'Includes app',
      'Live help (~60 min)',
      'VPN bring-up check',
      'Up to 2 devices',
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
        q: 'Is there a monthly VPN fee?',
        a: 'Not in the MVP. Stripe charges the app fee and optional assisted setup only. Traffic stays on your OCI instance.',
      },
      {
        q: 'How many devices can connect?',
        a: 'Many peers can be registered, but Always Free Micro (1/8 OCPU, 1 GB) is realistic for a handful to ~10 light concurrent users.',
      },
      {
        q: 'Do I share my whole Oracle account?',
        a: 'No. A least-privilege user with Compute/Networking rights is enough.',
      },
    ],
    finalTitle: 'Start assisted or self-serve.',
    finalDesc: 'The $10 purchase unlocks on this page once Stripe is wired.',
  },
  zh: {
    badge: 'Oracle Always Free × WireGuard',
    heroTitle: '用你的免费额度，搭你的 VPN。',
    heroDesc:
      'MinorWire 在你自己的 Oracle Cloud Always Free 上自动部署 WireGuard，并用小应用为 Windows / Android / iOS / Mac 签发配置。线路属于你——我们提供安装与管理工具。',
    ctaApp: '应用 $10（准备中）',
    ctaSetup: '协助安装 $100',
    ctaSoon: 'Stripe 支付准备中。需要协助安装请联系我们。',
    problemTitle: '我们不卖带宽',
    problemDesc:
      '不在我们这边堆服务器，而是在客户的 Always Free 上搭建最小环境，并把各设备配置做得足够好用。',
    howTitle: '使用方式',
    steps: [
      {
        title: '创建最小权限 API 密钥',
        desc: '复制应用内 IAM 策略，准备 Tenancy / User / Compartment OCID 与私钥。',
      },
      {
        title: '粘贴到应用并一键创建',
        desc: '自动创建 Micro 实例与可公网访问的 WireGuard。',
      },
      {
        title: '按设备签发配置',
        desc: '为 Windows / Android / iOS / Mac 添加 peer，用二维码或文件分发。',
      },
    ],
    pricingTitle: '价格（一次性）',
    planAppName: '自助安装',
    planAppPrice: '$10',
    planAppDesc: '应用费用，适合自行完成 IAM 与部署的用户。',
    planAppPoints: ['应用许可', '最小权限 IAM 指南', '自动部署', '设备配置 / 二维码'],
    planSetupName: '协助安装',
    planSetupPrice: '$100',
    planSetupDesc: '远程协助，从密钥创建到首次连通。',
    planSetupPoints: ['含应用', '在线协助（约60分钟）', 'VPN 启动确认', '最多2台设备'],
    needTitle: '你需要准备',
    needPoints: [
      '可使用 Always Free 的 Oracle Cloud 账号',
      '家庭区域仍有 Micro 名额',
      '专用 API 用户（无需共享完整管理员账号）',
    ],
    faqTitle: '常见问题',
    faqs: [
      {
        q: '有没有按月的 VPN 费用？',
        a: 'MVP 没有。Stripe 只收应用费和可选的协助安装费。流量走你自己的 OCI。',
      },
      {
        q: '可以连多少台设备？',
        a: '可注册很多 peer，但 Always Free Micro（1/8 OCPU、1GB）更适合少量到约10台轻度同时在线。',
      },
      {
        q: '需要共享整个 Oracle 账号吗？',
        a: '不需要。具备 Compute/Networking 的最小权限用户即可。',
      },
    ],
    finalTitle: '可先协助安装，也可自助开始。',
    finalDesc: 'Stripe 接通后，将在本页开放 $10 购买。',
  },
}

export default function MinorWirePage() {
  const { locale } = useLanguage()
  const c = COPY[locale] ?? COPY.ja

  return (
    <div className={`${dmSans.className} bg-[#f3f6f4] text-[#14201a]`}>
      {/* Hero — one composition */}
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
          <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-6">
            {c.badge}
          </p>
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
            <span className="inline-flex items-center justify-center px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold opacity-80 cursor-not-allowed">
              {c.ctaApp}
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md border border-[#1d3d2e]/30 bg-white/70 backdrop-blur font-semibold hover:bg-white transition-colors"
            >
              {c.ctaSetup}
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#5a6f64]">{c.ctaSoon}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
            <Link
              href="/contact"
              className="mt-8 inline-flex px-5 py-3 bg-white text-[#1d3d2e] font-semibold rounded-md hover:bg-[#e8f2ec] transition-colors"
            >
              {c.ctaSetup}
            </Link>
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
          <Link
            href="/contact"
            className="inline-flex px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
          >
            {c.ctaSetup}
          </Link>
        </div>
      </section>
    </div>
  )
}
