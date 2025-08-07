import { createI18n } from 'next-international'

export const { useI18n, useScopedI18n, I18nProvider } = createI18n({
  ru: () => import('./ru'),
})

export type Locale = 'ru'
export const locales: Locale[] = ['ru']
export const defaultLocale: Locale = 'ru' 