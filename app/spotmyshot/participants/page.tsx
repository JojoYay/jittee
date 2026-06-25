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
  searchX: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 7.5l-6 6m0-6 6 6',
  database: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  face: 'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  hashtag: 'M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5',
  collection: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z',
  banknote: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
  download: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9 4.5 4.5m0 0 4.5-4.5m-4.5 4.5V3',
}

const COPY = {
  ja: {
    badge: '大会に参加する方へ',
    heroTitle: 'あなたの一枚、すぐ見つかる。',
    heroDesc: '「自分の写真、どこにあるの？」——SpotMyShot なら、顔やゼッケン番号で検索するだけ。低価格・無料で、あなたのベストショットが見つかります。',
    ctaPrimary: 'SpotMyShotとは',
    ctaSecondary: 'お問い合わせ',
    problemsTitle: 'こんな経験、ありませんか？',
    problems: [
      { icon: 'searchX', title: '写真がバラバラで探せない', desc: 'フリーのカメラマンが Facebook や Google ドライブに上げた写真は、何百枚もの中から自分を探すのが大変。気づいたら時間だけが過ぎていきます。' },
      { icon: 'database', title: 'そもそも、どこにあるか分からない', desc: 'どのカメラマンが、どこに上げたのか。情報が散らばっていて、見つけられないまま終わってしまうことも。' },
    ],
    bandTitle: 'SpotMyShot なら、ぜんぶ一か所。',
    bandDesc: '大会の写真が一か所に集まり、顔・ゼッケン番号で検索できます。低価格や無料で、あなたの写真にすぐたどり着けます。',
    featuresTitle: 'できること',
    features: [
      { icon: 'face', title: '顔で検索', desc: '自分の顔で検索すれば、写っている写真がすぐ見つかります。' },
      { icon: 'hashtag', title: 'ゼッケン番号で検索', desc: 'ゼッケンの番号を入れるだけ。レース中のあなたの写真を一発で。' },
      { icon: 'collection', title: '一か所に集約', desc: '複数のカメラマンの写真が同じ場所に。あちこち探し回る必要はありません。' },
      { icon: 'banknote', title: '低価格・無料', desc: '運営コストを抑えた仕組みだから、写真は現実的な価格。無料で公開される写真もあります。' },
    ],
    stepsTitle: '使い方は、3ステップ',
    steps: [
      { n: '1', title: '検索する', desc: '参加した大会を選び、顔またはゼッケン番号で検索。' },
      { n: '2', title: '見つける', desc: 'あなたが写っている写真が一覧で表示されます。' },
      { n: '3', title: '購入・ダウンロード', desc: '気に入った一枚を、その場で手に入れられます。' },
    ],
    ctaTitle: '次のレースの「あの瞬間」を、手元に。',
    ctaDesc: 'SpotMyShot が使える大会や詳しい使い方は、お気軽にお問い合わせください。',
    ctaButton: 'お問い合わせ',
  },
  en: {
    badge: 'For Participants',
    heroTitle: 'Your shot — found in seconds.',
    heroDesc: '"Where are my photos?" With SpotMyShot, just search by face or bib number. Find your best shots at a low price — or for free.',
    ctaPrimary: 'What is SpotMyShot?',
    ctaSecondary: 'Contact us',
    problemsTitle: 'Sound familiar?',
    problems: [
      { icon: 'searchX', title: 'Photos scattered, impossible to find', desc: 'When freelance photographers post to Facebook or Google Drive, finding yourself among hundreds of photos is hard. Before you know it, you have lost a whole afternoon.' },
      { icon: 'database', title: 'You do not even know where they are', desc: 'Which photographer posted where? The information is scattered, and sometimes you give up before you ever find your shots.' },
    ],
    bandTitle: 'With SpotMyShot, it is all in one place.',
    bandDesc: 'Event photos gather in one place, searchable by face and bib number. Reach your photos instantly — at a low price, or free.',
    featuresTitle: 'What you can do',
    features: [
      { icon: 'face', title: 'Search by face', desc: 'Search with your own face and the photos you appear in show up right away.' },
      { icon: 'hashtag', title: 'Search by bib number', desc: 'Just enter your bib number to pull up your race photos in one shot.' },
      { icon: 'collection', title: 'All in one place', desc: 'Photos from multiple photographers in the same place. No more hunting around.' },
      { icon: 'banknote', title: 'Low price or free', desc: 'Low operating costs mean realistic prices — and some photos are published for free.' },
    ],
    stepsTitle: 'How it works — 3 steps',
    steps: [
      { n: '1', title: 'Search', desc: 'Pick the event you joined and search by face or bib number.' },
      { n: '2', title: 'Find', desc: 'The photos you appear in are shown in a list.' },
      { n: '3', title: 'Buy & download', desc: 'Get the shot you love, right there and then.' },
    ],
    ctaTitle: 'Keep "that moment" from your next race.',
    ctaDesc: 'Contact us anytime to learn which events use SpotMyShot and how to get started.',
    ctaButton: 'Contact us',
  },
}

export default function ParticipantsPage() {
  const { locale } = useLanguage()
  const c = locale === 'ja' ? COPY.ja : COPY.en
  const isJa = locale === 'ja'

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
                <Link href="/spotmyshot" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 transition-opacity">
                  {c.ctaPrimary}
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
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

      {/* ===== Problems ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{c.problemsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {c.problems.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="w-14 h-14 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
                  <Icon path={ICONS[p.icon as keyof typeof ICONS]} className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Band ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{c.bandTitle}</h2>
          <p className="text-lg text-white/90 leading-relaxed">{c.bandDesc}</p>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">{c.featuresTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {c.features.map((f, i) => (
              <div key={f.title} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Icon path={ICONS[f.icon as keyof typeof ICONS]} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Steps ===== */}
      <section className="py-20 bg-gray-50">
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
          <Link href="/spotmyshot/organizers" className="text-blue-600 font-semibold hover:underline">{isJa ? '大会運営者の方へ →' : 'For Organizers →'}</Link>
          <Link href="/spotmyshot" className="text-gray-500 hover:underline">{isJa ? 'SpotMyShotトップ' : 'SpotMyShot home'}</Link>
        </div>
      </section>
    </div>
  )
}
