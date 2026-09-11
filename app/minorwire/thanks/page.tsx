'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { useLanguage } from '../../contexts/LanguageContext'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

const WHATSAPP_PHONE = '+65 8815 4153'
const WHATSAPP_URL = 'https://wa.me/6588154153'

type ThanksCopy = {
  badge: string
  title: string
  body: string
  cta: string
  missing: string
  back: string
  supportTitle: string
  supportBody: string
  supportWhatsApp: string
  setupAssistBody: string
}

const THANKS: Record<string, ThanksCopy> = {
  ja: {
    badge: 'MinorWire',
    title: 'お支払いを確認しました',
    body: 'セットアップウィザードへ進んでください。OCI の最小権限キーを一度貼ると、Always Free 上に WireGuard サーバを1台作成します。その後は端末用 .conf を追加できます。',
    cta: 'セットアップを開く',
    missing: 'session id がありません。レシートメールのリンクを開くか info@jittee.com へ連絡してください。',
    back: 'MinorWire に戻る',
    supportTitle: 'サポート購入ありがとうございます',
    supportBody:
      '画面共有の日程は WhatsApp でご連絡ください。お名前と都合のよい時間帯を送ってください。',
    supportWhatsApp: 'WhatsApp で連絡する',
    setupAssistBody:
      'Assisted Setup をご購入の方も、ウィザードを開きつつ WhatsApp（+65 8815 4153）で日程を調整してください。',
  },
  en: {
    badge: 'MinorWire',
    title: 'Payment received',
    body: 'Continue to the setup wizard. Paste your least-privilege OCI API key once — we create one WireGuard server on your Always Free tenancy. After that you can mint more device .conf files anytime.',
    cta: 'Open setup wizard',
    missing: 'Missing session id. Open the link from your receipt email or contact info@jittee.com.',
    back: 'Back to MinorWire',
    supportTitle: 'Thanks for buying support',
    supportBody:
      'Please message us on WhatsApp to schedule screen-share. Include your name and a few time slots.',
    supportWhatsApp: 'Message on WhatsApp',
    setupAssistBody:
      'Assisted Setup buyers: open the wizard and also WhatsApp us (+65 8815 4153) to schedule.',
  },
  zh: {
    badge: 'MinorWire',
    title: '已收到付款',
    body: '请继续打开安装向导。粘贴一次最小权限 OCI API 密钥后，我们会在 Always Free 上创建一台 WireGuard 服务器，之后可再生成设备 .conf。',
    cta: '打开安装向导',
    missing: '缺少 session id。请打开收据邮件中的链接，或联系 info@jittee.com。',
    back: '返回 MinorWire',
    supportTitle: '感谢购买支持服务',
    supportBody: '请通过 WhatsApp 联系我们预约远程协助，并告知姓名与方便的时间。',
    supportWhatsApp: '通过 WhatsApp 联系',
    setupAssistBody: '购买 Assisted Setup 的用户请打开向导，并通过 WhatsApp（+65 8815 4153）预约时间。',
  },
}

function ThanksInner() {
  const { locale } = useLanguage()
  const c = THANKS[locale] ?? THANKS.ja
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const paid = params.get('paid')
  const isSupport = paid === 'support'
  const isSetup = paid === 'setup'
  const setupHref = sessionId
    ? `/minorwire/setup?session_id=${encodeURIComponent(sessionId)}`
    : null

  if (isSupport) {
    return (
      <div className={`${dmSans.className} min-h-[70vh] bg-[#f3f6f4] text-[#14201a]`}>
        <div className="max-w-2xl mx-auto px-4 py-24">
          <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-4">{c.badge}</p>
          <h1 className={`${syne.className} text-4xl font-extrabold mb-4`}>{c.supportTitle}</h1>
          <p className="text-[#3a4f44] leading-relaxed mb-4">{c.supportBody}</p>
          <p className="font-semibold text-[#1d3d2e] mb-8">{WHATSAPP_PHONE}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
          >
            {c.supportWhatsApp}
          </a>
          <p className="mt-10 text-sm text-[#5a6f64]">
            <Link href="/minorwire" className="underline">
              {c.back}
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${dmSans.className} min-h-[70vh] bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-2xl mx-auto px-4 py-24">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-4">{c.badge}</p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-4`}>{c.title}</h1>
        <p className="text-[#3a4f44] leading-relaxed mb-4">{c.body}</p>
        {isSetup && <p className="text-[#3a4f44] leading-relaxed mb-8">{c.setupAssistBody}</p>}
        {!isSetup && <div className="mb-8" />}

        <div className="flex flex-col sm:flex-row gap-3">
          {setupHref ? (
            <a
              href={setupHref}
              className="inline-flex px-6 py-3.5 rounded-md bg-[#1d3d2e] text-white font-semibold hover:bg-[#14201a] transition-colors"
            >
              {c.cta}
            </a>
          ) : (
            <p className="text-red-700">{c.missing}</p>
          )}
          {isSetup && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex px-6 py-3.5 rounded-md border border-[#1d3d2e] font-semibold"
            >
              {c.supportWhatsApp} ({WHATSAPP_PHONE})
            </a>
          )}
        </div>

        <p className="mt-10 text-sm text-[#5a6f64]">
          <Link href="/minorwire" className="underline">
            {c.back}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function MinorWireThanksPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <ThanksInner />
    </Suspense>
  )
}
