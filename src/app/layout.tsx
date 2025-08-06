import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/components/providers/AppProvider'
import { FORCE_REFRESH_KEY, CACHE_CONTROL_HEADERS } from './config'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Добавляем функцию для генерации метаданных
export async function generateMetadata() {
  return {
    title: 'M² - Технологии для риелторов',
    description: 'Профессиональная платформа для риелторов и агентств недвижимости',
    // Добавляем временную метку для принудительного обновления
    other: {
      'force-refresh': FORCE_REFRESH_KEY,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full bg-white">
      <head>
        {/* Добавляем мета-теги для отключения кэширования */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Добавляем временную метку для принудительного обновления */}
        <meta name="force-refresh" content={FORCE_REFRESH_KEY} />
      </head>
      <body className={`${inter.className} h-full`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}