import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/components/providers/AppProvider'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: 'M² - Технологии для риелторов',
  description: 'Профессиональная платформа для риелторов и агентств недвижимости',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full bg-white">
      <body className={`${inter.className} h-full`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}