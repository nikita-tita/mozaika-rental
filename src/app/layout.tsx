import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}