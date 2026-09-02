'use client'

import { useState } from 'react'
import Link from 'next/link'
import ImageModal from '../components/ImageModal'
import { useLanguage } from '../contexts/LanguageContext'

// SpoSched (スポスケ) 製品カードのコピー (3言語)。詳細は /sposched
const SPO: Record<string, { badge: string; tagline: string; desc: string; points: string[]; cta: string }> = {
  ja: {
    badge: '注目の製品',
    tagline: 'スポーツ団体の運営を、もっとシンプルに。',
    desc: '出欠・清算・会計・LINE連携をひとつのアプリに。チーム運営の“面倒”をまとめて解決するSaaSです。',
    points: ['スケジュール & 出欠', '清算（割り勘）', '会計', 'LINE連携 & リマインド', '写真・動画の共有'],
    cta: '詳しく見る',
  },
  en: {
    badge: 'Featured',
    tagline: 'Running your sports club, made simple.',
    desc: 'Attendance, settlement, accounting and LINE — all in one app. A SaaS that removes the hassle of running a team.',
    points: ['Schedule & Attendance', 'Settlement', 'Accounting', 'LINE integration & reminders', 'Photo & video sharing'],
    cta: 'Learn more',
  },
  zh: {
    badge: '主打产品',
    tagline: '让体育团体的运营，更简单。',
    desc: '考勤、结算、记账、LINE 联动，集于一个应用。为团队运营去除“麻烦”的 SaaS。',
    points: ['日程与考勤', '结算（分摊）', '记账', 'LINE 联动与提醒', '照片与视频共享'],
    cta: '了解更多',
  },
}

// 製品カード (SpotMyShot / Local Recorder)。各詳細ページへ遷移
const APPS: Record<string, { name: string; href: string; img: string; desc: string }[]> = {
  ja: [
    { name: 'SpotMyShot', href: '/spotmyshot', img: '/spotmyshot/spotMyShot_icon.png', desc: 'スポーツ大会の写真をシェア＆販売。顔・ゼッケンから自分の写真をすぐ検索できます。' },
    { name: 'Local Recorder', href: '/localrecorder', img: '/localrecorder/localRecorderIcon.png', desc: 'Teams / Zoom / ブラウザ会議をPCでローカル録画し、AIが議事録を自動作成 (Windows)。' },
  ],
  en: [
    { name: 'SpotMyShot', href: '/spotmyshot', img: '/spotmyshot/spotMyShot_icon.png', desc: 'Share & sell photos from sports events. Find your shots instantly by face or bib number.' },
    { name: 'Local Recorder', href: '/localrecorder', img: '/localrecorder/localRecorderIcon.png', desc: 'Record Teams / Zoom / browser meetings locally on your PC; AI writes the minutes (Windows).' },
  ],
  zh: [
    { name: 'SpotMyShot', href: '/spotmyshot', img: '/spotmyshot/spotMyShot_icon.png', desc: '分享与销售体育赛事照片。用人脸或号码布即可快速找到自己的照片。' },
    { name: 'Local Recorder', href: '/localrecorder', img: '/localrecorder/localRecorderIcon.png', desc: '在电脑本地录制 Teams / Zoom / 浏览器会议，AI 自动生成会议记录（Windows）。' },
  ],
}

export default function ProductsPage() {
  const [modalImage, setModalImage] = useState<{
    src: string
    alt: string
    title: string
  } | null>(null)
  const { t, locale } = useLanguage()
  const spo = SPO[locale] ?? SPO.ja
  const apps = APPS[locale] ?? APPS.ja

  const openModal = (src: string, alt: string, title: string) => {
    setModalImage({ src, alt, title })
  }

  const closeModal = () => {
    setModalImage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('productsTitle')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('productsSubtitle')}
          </p>
        </div>

        {/* SpoSched (スポスケ) — 注目の製品カード。詳細は /sposched */}
        <Link href="/sposched" className="block mb-12 group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-[#0F1A2B] via-[#1E3350] to-[#0F1A2B] text-white p-8 sm:p-10 transition-transform group-hover:scale-[1.01]">
            <span className="inline-block bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">★ {spo.badge}</span>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-3">
                  <img src="/sposched/mark.svg" alt="" aria-hidden="true"
                       className="h-12 sm:h-16 w-auto rounded-xl shadow" />
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">Spo<span className="text-white/60">Sched</span></span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow">{spo.tagline}</h2>
                <p className="text-white/95 mb-4 max-w-2xl">{spo.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {spo.points.map((p, i) => (
                    <span key={i} className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">{p}</span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 bg-[#F0B429] text-[#0F1A2B] font-bold px-6 py-2.5 rounded-full shadow group-hover:bg-[#F7C64F] transition-colors">
                  {spo.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* その他のプロダクト: SpotMyShot / Local Recorder */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {apps.map((a) => (
            <Link key={a.href} href={a.href} className="group bg-white rounded-xl shadow p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
              <img src={a.img} alt={a.name} className="w-14 h-14 rounded-xl object-contain flex-shrink-0 bg-gray-50" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{a.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* メインソリューション */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('mainSolution')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('mainSolutionDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">{t('developmentProcess')}</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">1.</span>
                  {t('developmentProcessSteps.step1')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">2.</span>
                  {t('developmentProcessSteps.step2')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">3.</span>
                  {t('developmentProcessSteps.step3')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">4.</span>
                  {t('developmentProcessSteps.step4')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">5.</span>
                  {t('developmentProcessSteps.step5')}
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">{t('technologies')}</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {t('technologiesList.web')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {t('technologiesList.mobile')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {t('technologiesList.cloud')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {t('technologiesList.api')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {t('technologiesList.database')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Case Studies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('caseStudies')}
          </h2>
          <div className="space-y-8">
            {/* LINE-Integrated Soccer App */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('soccerAppTitle')}
                </h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('soccerAppDescription')}
                </p>
                

                {/* Image Gallery */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('featuresGallery')}</h4>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/soccer/line1.png', 'LINE連携画面1', 'LINE連携機能')}>
                        <img 
                          src="/soccer/line1.png" 
                          alt="LINE連携画面1" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('soccerFeatures.line')}</p>
                      </div>
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/soccer/calendar.png', 'スケジュール管理', 'スケジュール管理機能')}>
                        <img 
                          src="/soccer/calendar.png" 
                          alt="スケジュール管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('soccerFeatures.schedule')}</p>
                      </div>
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/soccer/events.png', 'イベント管理', 'イベント管理機能')}>
                        <img 
                          src="/soccer/events.png" 
                          alt="イベント管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('soccerFeatures.events')}</p>
                      </div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/soccer/payment.png', '支払い管理', '支払い管理機能')}>
                        <img 
                          src="/soccer/payment.png" 
                          alt="支払い管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('soccerFeatures.payment')}</p>
                      </div>
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/soccer/expense.png', '経費管理', '経費管理機能')}>
                        <img 
                          src="/soccer/expense.png" 
                          alt="経費管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('soccerFeatures.expense')}</p>
                      </div>
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/soccer/video.png', 'ビデオ管理', 'ビデオ管理機能')}>
                        <img 
                          src="/soccer/video.png" 
                          alt="ビデオ管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('soccerFeatures.video')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('serviceContent')}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('soccerService')}
                  </p>
                </div>
              </div>
            </div>

            {/* Interior Progress Management App */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('interiorAppTitle')}
                </h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('interiorAppDescription')}
                </p>

                {/* Image Gallery */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('featuresGallery')}</h4>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/plotpict/projectList.png', 'プロジェクト管理', 'プロジェクト管理機能')}>
                        <img 
                          src="/plotpict/projectList.png" 
                          alt="プロジェクト管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('interiorFeatures.project')}</p>
                      </div>
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/plotpict/drawing.png', '図面管理', '図面管理機能')}>
                        <img 
                          src="/plotpict/drawing.png" 
                          alt="図面管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('interiorFeatures.drawing')}</p>
                      </div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/plotpict/interiorMonitor.png', '現場内装管理', '現場内装管理機能')}>
                        <img 
                          src="/plotpict/interiorMonitor.png" 
                          alt="現場内装管理" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('interiorFeatures.site')}</p>
                      </div>
                      <div className="text-center cursor-pointer group" onClick={() => openModal('/plotpict/comment.png', 'コミュニケーションボード', 'コミュニケーションボード機能')}>
                        <img 
                          src="/plotpict/comment.png" 
                          alt="コミュニケーションボード" 
                          className="w-full h-80 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700">{t('interiorFeatures.communication')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('serviceContent')}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('interiorService')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('customDevelopment')}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {t('customDevelopmentDescription')}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              {t('contactUs')}
            </a>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={closeModal}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          title={modalImage.title}
        />
      )}
    </div>
  )
} 