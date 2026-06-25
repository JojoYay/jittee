'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

function Icon({ path, className = 'w-6 h-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const ICONS = {
  gift: 'M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z',
  upload: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5',
  banknote: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
  eye: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  users: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
}

const COPY = {
  ja: {
    badge: 'カメラマンの方へ',
    heroTitle: '撮った写真を、置いておくだけで収益に。',
    heroDesc: 'SpotMyShot は、イベントで撮影した写真を登録するだけで、参加者が自分で見つけて購入してくれる写真販売プラットフォームです。営業も、面倒な受け渡しもいりません。あなたは撮影に集中できます。',
    ctaPrimary: '無料で参加する',
    ctaSecondary: 'SpotMyShotとは',
    valueTitle: 'カメラマンにとってのメリット',
    values: [
      { icon: 'gift', title: 'フリーで参加できる', desc: '登録は無料。初期費用も月額固定費もありません。まずは1大会から、気軽に始められます。' },
      { icon: 'upload', title: '登録するだけで、自動で売れていく', desc: '撮った写真をアップロードするだけ。参加者が顔やゼッケン番号で自分の写真を探し、その場で購入します。あなたが個別に対応する必要はありません。' },
      { icon: 'banknote', title: '高単価が期待できる', desc: '間接費を極限まで抑えた自動運用だから、余計な中抜きがありません。その分はカメラマンへ。1枚あたりの実入りが大きくなります。' },
    ],
    stepsTitle: 'はじめ方は、かんたん3ステップ',
    steps: [
      { n: '1', title: '登録（無料）', desc: 'メールで参加登録するだけ。難しい手続きはありません。' },
      { n: '2', title: '写真をアップロード', desc: '大会で撮った写真をまとめてアップ。顔・ゼッケン番号は自動で検索可能になります。' },
      { n: '3', title: 'あとは自動で販売・還元', desc: '参加者が自分で見つけて購入。売上はあなたに還元されます。' },
    ],
    bandTitle: 'なぜ、カメラマンの取り分が大きいのか？',
    bandDesc: '大がかりなスタッフや店舗を持たず、システムで自動運用しているからです。運営コストを極限まで抑えているので、写真は現実的な価格で売れて、その多くがあなたに届きます。',
    pointsTitle: 'こんなことが、できるようになります',
    points: [
      { icon: 'users', title: '人が集まる場所で見てもらえる', desc: '多くの競技者・参加者が集まる場で、あなたの写真が自然と目に触れます。' },
      { icon: 'banknote', title: '写真を販売して収益化', desc: '無料で配って終わり、ではなく、撮った写真をきちんと収益に変えられます。' },
      { icon: 'eye', title: '見つけてもらいやすい', desc: 'エンドユーザーが顔・ゼッケンで検索できるので、あなたの写真が埋もれません。' },
    ],
    ctaTitle: '次の大会から、SpotMyShot で。',
    ctaDesc: '参加登録・導入のご相談はお気軽にどうぞ。撮影に専念しながら、収益の新しい入り口をつくれます。',
    ctaButton: '無料で参加する',
  },
  en: {
    badge: 'For Photographers',
    heroTitle: 'Turn the photos you already shoot into income.',
    heroDesc: 'SpotMyShot is a photo-selling platform where you simply upload the photos you shot at an event, and participants find and buy their own shots. No sales calls, no tedious handovers — you stay focused on shooting.',
    ctaPrimary: 'Join for free',
    ctaSecondary: 'What is SpotMyShot?',
    valueTitle: 'What photographers get',
    values: [
      { icon: 'gift', title: 'Free to join', desc: 'Registration is free. No setup fees, no monthly fixed costs. Start casually with just one event.' },
      { icon: 'upload', title: 'Upload once, then it sells itself', desc: 'Just upload your shots. Participants search for themselves by face or bib number and buy on the spot. No need to handle each request yourself.' },
      { icon: 'banknote', title: 'Higher per-photo earnings', desc: 'Automated operation keeps overhead to a minimum, so there is no needless middleman cut. That difference goes back to you — more income per photo.' },
    ],
    stepsTitle: 'Getting started — 3 easy steps',
    steps: [
      { n: '1', title: 'Register (free)', desc: 'Just sign up by email. No complicated paperwork.' },
      { n: '2', title: 'Upload your photos', desc: 'Upload your event photos in bulk. Faces and bib numbers become searchable automatically.' },
      { n: '3', title: 'Sales & payouts on autopilot', desc: 'Participants find and buy their own photos. The proceeds come back to you.' },
    ],
    bandTitle: 'Why do photographers keep more?',
    bandDesc: 'Because there are no large teams or storefronts — it runs automatically on the system. With operating costs kept extremely low, photos sell at realistic prices and most of it reaches you.',
    pointsTitle: 'Here is what becomes possible',
    points: [
      { icon: 'users', title: 'Seen where the crowd is', desc: 'Your photos are naturally seen in a place where many runners and participants gather.' },
      { icon: 'banknote', title: 'Earn by selling', desc: 'Instead of giving everything away for free, turn the photos you shoot into real income.' },
      { icon: 'eye', title: 'Easy to be found', desc: 'End users can search by face and bib number, so your photos never get buried.' },
    ],
    ctaTitle: 'Use SpotMyShot from your next event.',
    ctaDesc: 'Reach out anytime to join or to discuss getting set up. Build a new income stream while you focus on shooting.',
    ctaButton: 'Join for free',
  },
}

export default function PhotographersPage() {
  const { locale } = useLanguage()
  const c = locale === 'ja' ? COPY.ja : COPY.en

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 12% 20%, rgba(37,99,235,0.10) 0, transparent 42%), radial-gradient(circle at 88% 15%, rgba(249,115,22,0.12) 0, transparent 40%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/spotmyshot/spotMyShot_logo.png" alt="SpotMyShot" className="h-9 md:h-12 w-auto" />
              <span className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
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

      {/* ===== Values ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{c.valueTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.values.map((v, i) => (
              <div key={v.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${i === 1 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Icon path={ICONS[v.icon as keyof typeof ICONS]} className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Steps ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{c.stepsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Band: why higher payout ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{c.bandTitle}</h2>
          <p className="text-lg text-white/90 leading-relaxed">{c.bandDesc}</p>
        </div>
      </section>

      {/* ===== Points ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{c.pointsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.points.map((p, i) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Icon path={ICONS[p.icon as keyof typeof ICONS]} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed">{p.desc}</p>
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
          <span className="text-gray-500">{locale === 'ja' ? '他の方向け：' : 'For others:'}</span>
          <Link href="/spotmyshot/organizers" className="text-blue-600 font-semibold hover:underline">{locale === 'ja' ? '大会運営者の方へ →' : 'For Organizers →'}</Link>
          <Link href="/spotmyshot/participants" className="text-blue-600 font-semibold hover:underline">{locale === 'ja' ? '参加者の方へ →' : 'For Participants →'}</Link>
          <Link href="/spotmyshot" className="text-gray-500 hover:underline">{locale === 'ja' ? 'SpotMyShotトップ' : 'SpotMyShot home'}</Link>
        </div>
      </section>
    </div>
  )
}
