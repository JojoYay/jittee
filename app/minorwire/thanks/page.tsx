'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Syne, DM_Sans } from 'next/font/google'
import { useLanguage } from '../../contexts/LanguageContext'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

const THANKS: Record<
  string,
  { badge: string; title: string; body: string; cta: string; missing: string; back: string }
> = {
  ja: {
    badge: 'MinorWire',
    title: 'お支払いを確認しました',
    body: 'セットアップウィザードへ進んでください。OCI の最小権限キーを一度貼ると、Always Free 上に WireGuard サーバを1台作成します。その後は端末用 .conf を追加できます。サポート付き購入の方は info@jittee.com へ日程連絡ください。',
    cta: 'セットアップを開く',
    missing: 'session id がありません。レシートメールのリンクを開くか info@jittee.com へ連絡してください。',
    back: 'MinorWire に戻る',
  },
  en: {
    badge: 'MinorWire',
    title: 'Payment received',
    body: 'Continue to the setup wizard. Paste your least-privilege OCI API key once — we create one WireGuard server on your Always Free tenancy. After that you can mint more device .conf files anytime. Assisted buyers: email info@jittee.com to schedule screen-share.',
    cta: 'Open setup wizard',
    missing: 'Missing session id. Open the link from your receipt email or contact info@jittee.com.',
    back: 'Back to MinorWire',
  },
  zh: {
    badge: 'MinorWire',
    title: '已收到付款',
    body: '请继续打开安装向导。粘贴一次最小权限 OCI API 密钥后，我们会在 Always Free 上创建一台 WireGuard 服务器，之后可再生成设备 .conf。协助安装买家请邮件联系 info@jittee.com 预约。',
    cta: '打开安装向导',
    missing: '缺少 session id。请打开收据邮件中的链接，或联系 info@jittee.com。',
    back: '返回 MinorWire',
  },
}

function ThanksInner() {
  const { locale } = useLanguage()
  const c = THANKS[locale] ?? THANKS.ja
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const setupHref = sessionId
    ? `/minorwire/setup?session_id=${encodeURIComponent(sessionId)}`
    : null

  return (
    <div className={`${dmSans.className} min-h-[70vh] bg-[#f3f6f4] text-[#14201a]`}>
      <div className="max-w-2xl mx-auto px-4 py-24">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-[#2f6b4f] mb-4">{c.badge}</p>
        <h1 className={`${syne.className} text-4xl font-extrabold mb-4`}>{c.title}</h1>
        <p className="text-[#3a4f44] leading-relaxed mb-8">
          {c.body.split('info@jittee.com').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <a className="underline" href="mailto:info@jittee.com">
                  info@jittee.com
                </a>
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>

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
