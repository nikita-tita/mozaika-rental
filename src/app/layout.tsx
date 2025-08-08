import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/components/providers/AppProvider'

// Используем системные шрифты вместо Google Fonts для Docker
const inter = { className: 'font-sans' }

export const metadata: Metadata = {
  title: 'M² - Технологии для риелторов',
  description: 'Профессиональные инструменты для упрощения работы риелторов',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}