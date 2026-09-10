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
 * MinorWire marketing page.
 * Purchase surface avoids naming the underlying cloud / VPN stack brands.
 */

interface Copy {
  badge: string
  heroTitle: string
  heroDesc: string
  teaserTitle: string
  teaserBody: string
  freeOpsTitle: string
  freeOpsBody: string
  ctaApp: string
  ctaSetup: string
  ctaNote: string
  conceptTitle: string
  conceptDesc: string
  deliveryTitle: string
  deliveryLead: string
  deliveryCloud: string
  deliveryCloudWho: string
  deliveryServer: string
  deliveryServerWho: string
  deliveryGuide: string
  deliveryTogether: string
  compareTitle: string
  compareIntro: string
  compareProsTitle: string
  comparePros: string[]
  compareConsTitle: string
  compareCons: string[]
  howTitle: string
  steps: { title: string; desc: string }[]
  chooseTitle: string
  chooseIntro: string
  pricingTitle: string
  planAppName: string
  planAppPrice: string
  planAppDesc: string
  planAppPoints: string[]
  planAppBest: string
  planSetupName: string
  planSetupPrice: string
  planSetupDesc: string
  planSetupPoints: string[]
  planSetupBest: string
  needTitle: string
  needPoints: string[]
  needLead: string
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
    badge: '自分のクラウドで動く、自分の VPN',
    heroTitle: '一度つくれば、毎月の運用費は基本ゼロ。',
    heroDesc:
      'あなたが用意するクラウド上に、専用の VPN サーバーを1台自動で立てます。キーを登録するだけで完了。回線もサーバーもあなたのものなので、有名な月額 VPN サービスのような毎月課金はありません。',
    teaserTitle: 'VPNサーバーを立ててテレビを見よう',
    teaserBody:
      '海外にいても、選んだ国からアクセスしているように見せるためのシンプルな VPN サーバーです。セットアップは約5分で完了します。',
    freeOpsTitle: '毎月の運用費用は無料',
    freeOpsBody:
      'クラウド側の無料枠の範囲で動かせば、サーバー代・VPN 利用料としての月額はかかりません。かかるのは最初のセットアップ料金（買い切り）だけです。',
    ctaApp: '自分で設定 S$10（PayNow）',
    ctaSetup: 'Jittee に設定してもらう S$100（PayNow）',
    ctaNote: '決済は Stripe PayNow。支払い後にセットアップ画面へ進みます（メールでも URL を送付）。',
    conceptTitle: '何をするサービスか',
    conceptDesc:
      '帯域を売り続ける VPN 会社ではありません。あなたのクラウドに小さな専用 VPN サーバーを1台作り、スマホや PC からつなげる設定まで自動で用意します。',
    deliveryTitle: 'いまの提供形態',
    deliveryLead: 'アプリのダウンロードや CLI の ZIP ではありません。クラウドの中に、あなた専用の VPN サーバーを1台置く形です。',
    deliveryCloud: 'クラウド',
    deliveryCloudWho: 'お客様がサインアップして準備',
    deliveryServer: 'VPN サーバー',
    deliveryServerWho: 'Jittee が用意・起動',
    deliveryGuide: 'やり方がわからない場合でも大丈夫。画面の手順は Jittee が説明します。',
    deliveryTogether: 'それでも不安なときは、一緒に設定するオプションもあります。',
    compareTitle: 'NordVPN / ExpressVPN などとの違い',
    compareIntro:
      '大手 VPN は「いつでもつながる月額サービス」。MinorWire は「自分のクラウドに一度立てて、以後ほぼ無料で使う」道具です。',
    compareProsTitle: 'メリット',
    comparePros: [
      '一度設定すれば、以後の毎月の運用費用は基本無料（クラウド等の無料枠・ポリシーが変わらない前提）',
      'サーバーと回線が自分名義なので、誰かの共有 VPN に乗らない',
      '買い切りのツール代のみ。月額サブスクを払い続けなくてよい',
    ],
    compareConsTitle: 'デメリット',
    compareCons: [
      'エンタープライズ級で大量同時接続・高帯域が必要な用途にはスペックが足りない',
      '利用しているクラウドの規約や無料枠が変わると、将来料金が発生する可能性がある',
      '最初にクラウド口座の準備と短いセットアップが必要（大手 VPN の「すぐ契約して使う」より手間）',
    ],
    howTitle: '流れ',
    steps: [
      {
        title: 'クラウド口座を用意',
        desc: '無料枠が使えるクラウドアカウントを作り、VPN を置きたい地域を選びます。',
      },
      {
        title: 'キーを登録するだけ',
        desc: '管理者用の API キーをセットアップ画面に貼ると、専用 VPN サーバーを自動作成します。',
      },
      {
        title: '端末につなぐ',
        desc: '表示された接続設定をスマホや PC の VPN アプリに入れます。追加端末も同じ画面から作れます。',
      },
    ],
    chooseTitle: 'どっちがよいですか？',
    chooseIntro:
      '手順はかなり簡単なので、案内に沿って自分で設定できます。時間を節約したい・一緒に確認しながら進めたい場合は、Jittee に設定を依頼（有料）も選べます。',
    pricingTitle: '料金（買い切り・SGD）',
    planAppName: '自分で設定',
    planAppPrice: 'S$10',
    planAppDesc: 'インストラクションに沿って自分でキー登録〜起動まで進める方向け。',
    planAppPoints: [
      '画面の手順どおりに進めれば完了',
      'キー登録だけでサーバー自動作成',
      '購入ごとにサーバー構築は1回',
      '端末の接続設定は追加発行可',
    ],
    planAppBest: '自分で触るのが苦にならない人向け',
    planSetupName: 'Jittee に設定してもらう',
    planSetupPrice: 'S$100',
    planSetupDesc: '画面共有などで、キー作成から最初の接続まで一緒に完了します。',
    planSetupPoints: [
      'セルフ機能も含む',
      'ライブサポート（目安60分）',
      'VPN 起動まで確認',
      '複数端末の設定も一緒に',
    ],
    planSetupBest: '最短で確実に終わらせたい人向け',
    needTitle: '必要なもの',
    needPoints: ['メールアドレス', 'クレジットカード'],
    needLead: '上記を用意し、PayNow 支払いを行うだけで、あなたのプライベート VPN サーバーを構築できます。',
    faqTitle: 'FAQ',
    faqs: [
      {
        q: '毎月の VPN 料金はありますか？',
        a: 'ありません。無料枠の範囲で動かせば、運用の月額は基本ゼロです。Stripe で払うのは最初のツール代（と希望者向けの設定代行）だけです。',
      },
      {
        q: 'NordVPN などと何が違いますか？',
        a: '大手は月額で帯域とサーバーを借りるサービスです。こちらは自分のクラウドに専用サーバーを一度立てる方式で、以後の月額を抑えられます。その代わり、大規模利用やクラウド規約変更のリスクは自分側にあります。',
      },
      {
        q: 'API キーは保存されますか？',
        a: 'お客様のクラウド API キーは構築中だけ使い、永続保存しません。あとから端末設定を追加するため、サーバー接続用の鍵だけ暗号化して保持します。',
      },
      {
        q: '何台までつながりますか？',
        a: '購入1回あたりサーバー構築は1回です。端末ごとの接続設定は何度でも追加できます。同時利用の現実目安は数台〜十台前後のライト利用です。',
      },
    ],
    finalTitle: 'まず、自分でやるか・任せるかを選んでください。',
    finalDesc: 'どちらも支払い後すぐにセットアップ画面へ進めます。迷ったらサポート付きが確実です。',
    paidAppTitle: 'お支払いありがとうございます（自分で設定）',
    paidAppBody: 'セットアップ画面へ進んでください。メールにも同じ URL を送っています。',
    paidSetupTitle: 'お支払いありがとうございます（設定代行）',
    paidSetupBody: 'ウィザードで進めつつ、日程は info@jittee.com までご連絡ください。',
    paidMailCta: 'メールで連絡する',
  },
  en: {
    badge: 'Your cloud. Your private VPN.',
    heroTitle: 'Set it up once. Monthly ops stay free.',
    heroDesc:
      'We automatically create one dedicated VPN server on the cloud account you provide. Just register an admin API key. Because the server and pipe are yours, there is no recurring fee like popular monthly VPN brands.',
    teaserTitle: 'Spin up a VPN server. Watch TV like you\'re home.',
    teaserBody:
      'A simple VPN server so that while you are overseas, it looks like you are accessing from a country you choose. Setup finishes in about five minutes.',
    freeOpsTitle: 'Monthly operating cost: free',
    freeOpsBody:
      'Stay within the cloud free allowance and you do not pay monthly server or VPN usage fees. You only pay the one-time setup fee.',
    ctaApp: 'Do it yourself S$10 (PayNow)',
    ctaSetup: 'Have Jittee set it up S$100 (PayNow)',
    ctaNote: 'Stripe PayNow. After payment you open the setup wizard (URL also emailed).',
    conceptTitle: 'What this is',
    conceptDesc:
      'We are not a bandwidth subscription company. We place a small dedicated VPN server on your cloud and prepare device connection settings automatically.',
    deliveryTitle: 'How it is delivered',
    deliveryLead:
      'Not a downloadable app or CLI ZIP. We place one dedicated VPN server inside your cloud account.',
    deliveryCloud: 'Cloud',
    deliveryCloudWho: 'You sign up and prepare it',
    deliveryServer: 'VPN server',
    deliveryServerWho: 'Jittee provisions and starts it',
    deliveryGuide: 'If the steps feel unfamiliar, Jittee explains the process on screen.',
    deliveryTogether: 'Still unsure? There is an option to set it up together with Jittee.',
    compareTitle: 'Compared with NordVPN / ExpressVPN and similar',
    compareIntro:
      'Big VPN brands sell a monthly “always-on” service. MinorWire is a tool to host one VPN on your own cloud and keep ongoing cost near zero.',
    compareProsTitle: 'Pros',
    comparePros: [
      'Once configured, ongoing monthly cost is basically free (assuming cloud free-tier policy does not change)',
      'Server and traffic sit on your own account — not a shared commercial VPN pool',
      'One-time tool fee instead of paying a subscription forever',
    ],
    compareConsTitle: 'Cons',
    compareCons: [
      'Not enough capacity for enterprise-scale concurrent use or heavy bandwidth',
      'If the cloud provider changes terms or free allowances, fees may appear later',
      'Needs a short one-time cloud + setup step (more effort than “subscribe and connect” apps)',
    ],
    howTitle: 'How it works',
    steps: [
      {
        title: 'Prepare a cloud account',
        desc: 'Create a free-tier-capable cloud account in the region where you want the VPN.',
      },
      {
        title: 'Register a key',
        desc: 'Paste an admin API key into the setup screen — we create the dedicated VPN server automatically.',
      },
      {
        title: 'Connect devices',
        desc: 'Import the connection profile into a free official VPN client on phone or PC. Add more devices anytime.',
      },
    ],
    chooseTitle: 'Which option is better for you?',
    chooseIntro:
      'Setup is simple enough to follow the on-screen instructions yourself. If you prefer speed and a guided session, pay Jittee to configure it with you.',
    pricingTitle: 'Pricing (one-time, SGD)',
    planAppName: 'Do it yourself',
    planAppPrice: 'S$10',
    planAppDesc: 'Follow the instructions and finish key registration through first connect on your own.',
    planAppPoints: [
      'Step-by-step on-screen guide',
      'Key registration creates the server automatically',
      'One server provision per purchase',
      'Extra device profiles anytime',
    ],
    planAppBest: 'Best if you are fine clicking through a short guide',
    planSetupName: 'Have Jittee set it up',
    planSetupPrice: 'S$100',
    planSetupDesc: 'Screen-share from key creation to first successful connection.',
    planSetupPoints: [
      'Includes the self-serve flow',
      'Live help (~60 min)',
      'Confirm VPN is up',
      'Add multiple device profiles together',
    ],
    planSetupBest: 'Best if you want it done quickly and checked live',
    needTitle: 'What you need',
    needPoints: ['Email address', 'Credit card'],
    needLead: 'Prepare those, pay with PayNow, and we build your private VPN server.',
    faqTitle: 'FAQ',
    faqs: [
      {
        q: 'Is there a monthly VPN fee?',
        a: 'No. Within the free cloud allowance, monthly ops are basically free. Stripe only charges the one-time tool fee (and optional assisted setup).',
      },
      {
        q: 'How is this different from NordVPN and similar?',
        a: 'Those services rent shared capacity monthly. Here you host one dedicated server on your own cloud after a one-time setup, so ongoing cost stays low — with trade-offs on scale and cloud-policy risk.',
      },
      {
        q: 'Do you store my API key?',
        a: 'Your cloud API key is used in memory during provisioning and not persisted. An encrypted instance key is kept only so you can add more device profiles later.',
      },
      {
        q: 'How many devices can connect?',
        a: 'One server provision per purchase. Device profiles can be added anytime. Concurrent light use is realistically a handful to about ten devices.',
      },
    ],
    finalTitle: 'Pick DIY or assisted — then start.',
    finalDesc: 'Either path opens the setup wizard right after PayNow. If unsure, assisted is the safer choice.',
    paidAppTitle: 'Thanks for your payment (DIY)',
    paidAppBody: 'Continue to the setup wizard. The same URL is emailed.',
    paidSetupTitle: 'Thanks for your payment (assisted)',
    paidSetupBody: 'Use the wizard, and email info@jittee.com to schedule screen-share.',
    paidMailCta: 'Email us',
  },
  zh: {
    badge: '跑在你自己云上的专属 VPN',
    heroTitle: '设置一次，之后月费基本为零。',
    heroDesc:
      '我们在你准备的云账号上自动创建一台专属 VPN 服务器。只需登记管理员 API 密钥。服务器与线路归你，因此不像常见月付 VPN 品牌那样每月收费。',
    teaserTitle: '搭一台 VPN 服务器，像在家一样看电视',
    teaserBody:
      '这是一台简单的 VPN 服务器，让你在海外时看起来像从选定的国家访问。大约 5 分钟即可完成设置。',
    freeOpsTitle: '每月运营费用：免费',
    freeOpsBody:
      '在云免费额度内运行时，没有按月的服务器费或 VPN 使用费。你只需支付一次性的设置费用。',
    ctaApp: '自己设置 S$10（PayNow）',
    ctaSetup: '请 Jittee 代为设置 S$100（PayNow）',
    ctaNote: 'Stripe PayNow。付款后进入设置向导（邮件也会发送链接）。',
    conceptTitle: '这是什么服务',
    conceptDesc:
      '我们不是持续出售带宽的 VPN 公司。我们在你的云上搭建一台小型专属 VPN 服务器，并自动准备手机 / 电脑的连接配置。',
    deliveryTitle: '当前提供方式',
    deliveryLead: '不是下载 App，也不是 CLI ZIP。我们在你的云账号里放置一台专属 VPN 服务器。',
    deliveryCloud: '云',
    deliveryCloudWho: '由你注册并准备',
    deliveryServer: 'VPN 服务器',
    deliveryServerWho: '由 Jittee 准备并启动',
    deliveryGuide: '即使不熟悉流程也没关系，Jittee 会在页面上说明怎么做。',
    deliveryTogether: '仍不确定时，也可以选择与 Jittee 一起完成设置。',
    compareTitle: '与 NordVPN / ExpressVPN 等的区别',
    compareIntro:
      '大型 VPN 卖的是按月“随时可连”的服务。MinorWire 是把 VPN 放到你自己的云上、尽量把后续费用压到接近零的工具。',
    compareProsTitle: '优点',
    comparePros: [
      '设置一次后，后续月运营费基本免费（前提是云免费额度与政策不变）',
      '服务器与流量在你自己的账号上，不进入别人的共享 VPN 池',
      '一次性工具费，不必长期付订阅',
    ],
    compareConsTitle: '缺点',
    compareCons: [
      '不适合企业级大量并发或高带宽场景，规格有限',
      '若云厂商条款或免费额度变更，将来可能产生费用',
      '需要一次性准备云账号并完成短设置（比“订阅即用”多一步）',
    ],
    howTitle: '流程',
    steps: [
      {
        title: '准备云账号',
        desc: '创建可用免费额度的云账号，并选择你想放置 VPN 的区域。',
      },
      {
        title: '登记密钥即可',
        desc: '在设置页粘贴管理员 API 密钥，我们会自动创建专属 VPN 服务器。',
      },
      {
        title: '连接设备',
        desc: '把连接配置导入手机或电脑的免费官方 VPN 客户端。可随时追加设备。',
      },
    ],
    chooseTitle: '该选哪一种？',
    chooseIntro:
      '流程很简单，可以按说明自己完成。若想省时间、希望有人一起确认，也可以付费请 Jittee 代为设置。',
    pricingTitle: '价格（一次性 · SGD）',
    planAppName: '自己设置',
    planAppPrice: 'S$10',
    planAppDesc: '按说明自行完成密钥登记到首次连通。',
    planAppPoints: ['按页面步骤即可完成', '登记密钥后自动建服务器', '每次购买仅搭建一次服务器', '设备配置可反复追加'],
    planAppBest: '适合愿意自己点几步的人',
    planSetupName: '请 Jittee 代为设置',
    planSetupPrice: 'S$100',
    planSetupDesc: '远程协助，从密钥创建到首次连通一起完成。',
    planSetupPoints: ['含自助流程', '在线协助（约60分钟）', '确认 VPN 已启动', '一起添加多台设备配置'],
    planSetupBest: '适合想尽快、稳妥完成的人',
    needTitle: '你需要准备',
    needPoints: ['邮箱地址', '信用卡'],
    needLead: '准备好以上两项，用 PayNow 付款即可开始搭建你的专属 VPN 服务器。',
    faqTitle: '常见问题',
    faqs: [
      {
        q: '有没有按月的 VPN 费用？',
        a: '没有。在云免费额度内，月运营费基本为零。Stripe 只收一次性工具费（以及可选的代设费）。',
      },
      {
        q: '和 NordVPN 等有什么不同？',
        a: '那些服务按月租用共享带宽。这里是在你自己的云上搭建一台专属服务器，后续费用更低，但大规模使用与云政策变更风险由你承担。',
      },
      {
        q: '会保存我的 API 密钥吗？',
        a: '云 API 密钥只在部署时使用，不会持久保存。为追加设备配置，仅加密保存实例连接密钥。',
      },
      {
        q: '可以连多少台设备？',
        a: '每次购买只搭建一次服务器。设备配置可随时追加。同时轻度使用更现实的是数台到约十台。',
      },
    ],
    finalTitle: '先选自己设置，还是请人设置。',
    finalDesc: '两种方式付款后都会立刻进入设置向导。不确定时选代设更稳妥。',
    paidAppTitle: '感谢付款（自己设置）',
    paidAppBody: '请继续打开设置向导。邮件中也有同样的链接。',
    paidSetupTitle: '感谢付款（代为设置）',
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
          <div className="mt-6 max-w-xl border-l-2 border-[#2f6b4f] pl-4">
            <p className="font-semibold text-[#1d3d2e]">{c.freeOpsTitle}</p>
            <p className="mt-1 text-[#3a4f44] leading-relaxed">{c.freeOpsBody}</p>
          </div>

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

      <section className="bg-[#1d3d2e] text-[#e8f2ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <h2
            className={`${syne.className} text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-3xl leading-tight`}
          >
            {c.teaserTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#cfe7da] max-w-2xl leading-relaxed">
            {c.teaserBody}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.conceptTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-10">{c.conceptDesc}</p>

        <h3 className={`${syne.className} text-2xl font-bold mb-3`}>{c.deliveryTitle}</h3>
        <p className="text-[#3a4f44] max-w-3xl leading-relaxed mb-8">{c.deliveryLead}</p>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center max-w-5xl">
          <svg
            viewBox="0 0 560 320"
            role="img"
            aria-label={`${c.deliveryCloud}: ${c.deliveryCloudWho}. ${c.deliveryServer}: ${c.deliveryServerWho}.`}
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="mwCloudFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dff0e7" />
                <stop offset="100%" stopColor="#c5dfd1" />
              </linearGradient>
            </defs>
            <ellipse cx="280" cy="210" rx="210" ry="58" fill="#b7d4c4" opacity="0.45" />
            <path
              d="M145 175c0-48 38-86 86-86 14 0 27 3 39 9 14-36 49-61 90-61 54 0 98 44 98 98 0 4 0 8-1 12 32 8 55 37 55 71 0 41-33 74-74 74H168c-45 0-81-36-81-81 0-33 20-62 48-74z"
              fill="url(#mwCloudFill)"
              stroke="#2f6b4f"
              strokeWidth="3"
            />
            <rect x="220" y="145" width="120" height="88" rx="10" fill="#1d3d2e" />
            <rect x="232" y="158" width="96" height="10" rx="3" fill="#7dba98" />
            <rect x="232" y="176" width="96" height="10" rx="3" fill="#7dba98" opacity="0.75" />
            <rect x="232" y="194" width="96" height="10" rx="3" fill="#7dba98" opacity="0.5" />
            <circle cx="318" cy="214" r="5" fill="#9fd6b8" />
            <text
              x="280"
              y="128"
              textAnchor="middle"
              fill="#14201a"
              fontSize="18"
              fontWeight="700"
              fontFamily="system-ui,sans-serif"
            >
              {c.deliveryServer}
            </text>
            <text
              x="280"
              y="268"
              textAnchor="middle"
              fill="#2f6b4f"
              fontSize="16"
              fontWeight="700"
              fontFamily="system-ui,sans-serif"
            >
              {c.deliveryCloud}
            </text>
          </svg>

          <div className="space-y-6">
            <div className="border-l-2 border-[#7dba98] pl-4">
              <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-semibold">{c.deliveryCloud}</p>
              <p className="mt-1 text-lg text-[#14201a] font-semibold leading-relaxed">{c.deliveryCloudWho}</p>
            </div>
            <div className="border-l-2 border-[#1d3d2e] pl-4">
              <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-semibold">{c.deliveryServer}</p>
              <p className="mt-1 text-lg text-[#14201a] font-semibold leading-relaxed">{c.deliveryServerWho}</p>
            </div>
            <p className="text-[#3a4f44] leading-relaxed">{c.deliveryGuide}</p>
            <p className="text-[#3a4f44] leading-relaxed font-medium">{c.deliveryTogether}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.compareTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-10">{c.compareIntro}</p>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl">
          <div>
            <h3 className={`${syne.className} text-xl font-bold text-[#2f6b4f] mb-4`}>
              {c.compareProsTitle}
            </h3>
            <ul className="space-y-3 text-[#3a4f44]">
              {c.comparePros.map((p) => (
                <li key={p} className="border-l-2 border-[#7dba98] pl-4 leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`${syne.className} text-xl font-bold text-[#6b4f2f] mb-4`}>
              {c.compareConsTitle}
            </h3>
            <ul className="space-y-3 text-[#3a4f44]">
              {c.compareCons.map((p) => (
                <li key={p} className="border-l-2 border-[#c4a574] pl-4 leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
        <h2 className={`${syne.className} text-3xl font-bold mb-4`}>{c.chooseTitle}</h2>
        <p className="text-lg text-[#3a4f44] max-w-3xl leading-relaxed mb-4">{c.chooseIntro}</p>
        <h3 className={`${syne.className} text-2xl font-bold mb-10`}>{c.pricingTitle}</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-[#1d3d2e]/15 bg-white/80 p-8">
            <p className="text-sm uppercase tracking-wider text-[#2f6b4f] font-medium">{c.planAppName}</p>
            <p className={`${syne.className} text-5xl font-bold mt-2`}>{c.planAppPrice}</p>
            <p className="mt-2 text-sm font-semibold text-[#2f6b4f]">{c.planAppBest}</p>
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
            <p className="mt-2 text-sm font-semibold text-[#9fd6b8]">{c.planSetupBest}</p>
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
        <p className="mt-6 text-lg text-[#14201a] font-semibold max-w-3xl leading-relaxed">{c.needLead}</p>
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
