'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, locale } = useLanguage()

  // RunRank is an external app; link to the locale-matched site (Japanese -> /ja, otherwise /en)
  const runRankUrl = locale === 'ja' ? 'https://runrank.jittee.com/ja' : 'https://runrank.jittee.com/en'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src="/logo_final.png"
                alt="Jittee Pte. Ltd."
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                {t('home')}
              </Link>
              <Link href="/strengths" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                {t('strengths')}
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                {t('products')}
              </Link>
              <div className="relative group">
                <button className="inline-flex items-center gap-1 text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('download')}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                  <div className="w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1">
                    <Link href="/localrecorder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                      Local Recorder
                    </Link>
                    <Link href="/easydb" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                      EasyDB
                    </Link>
                    <a href={runRankUrl} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                      RunRank
                    </a>
                  </div>
                </div>
              </div>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                {t('contact')}
              </Link>
            </div>
            <LanguageSwitcher />
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('home')}
          </Link>
          <Link
            href="/strengths"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('strengths')}
          </Link>
          <Link
            href="/products"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('products')}
          </Link>
          <div className="px-3 pt-2">
            <p className="px-0 py-1 text-base font-medium text-gray-900">{t('download')}</p>
            <Link
              href="/localrecorder"
              className="block pl-4 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Local Recorder
            </Link>
            <Link
              href="/easydb"
              className="block pl-4 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              EasyDB
            </Link>
            <a
              href={runRankUrl}
              className="block pl-4 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              RunRank
            </a>
          </div>
          <Link
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('contact')}
          </Link>
        </div>
      </div>
    </nav>
  )
} 