'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Locale, defaultLocale, translations, localeNames } from '../../lib/i18n'
import Cookies from 'js-cookie'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  localeNames: Record<Locale, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const cookieLocale = Cookies.get('locale') as Locale | undefined
    return cookieLocale && Object.keys(localeNames).includes(cookieLocale) ? cookieLocale : defaultLocale
  })

  useEffect(() => {
    // Sync locale from cookie on mount (in case cookie was changed elsewhere)
    const cookieLocale = Cookies.get('locale') as Locale | undefined
    if (cookieLocale && Object.keys(localeNames).includes(cookieLocale) && cookieLocale !== locale) {
      setLocale(cookieLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    Cookies.set('locale', newLocale, { expires: 365 })
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key as is if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ 
      locale, 
      setLocale: handleSetLocale, 
      t, 
      localeNames 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 