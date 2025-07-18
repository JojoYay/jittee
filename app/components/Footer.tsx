'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center">
              <img
                src="/logo_final.png"
                alt="Jittee"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-base">
              {t('companyDescription')}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                {t('services')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/products" className="text-base text-gray-300 hover:text-white">
                    {t('products')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                {t('contactInfo')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li className="text-base text-gray-300">
                  {t('address')}
                </li>
                <li className="text-base text-gray-300">
                  {t('phoneInfo')}
                </li>
                <li className="text-base text-gray-300">
                  {t('email')}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
} 