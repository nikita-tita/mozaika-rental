import type { Metadata } from 'next'
import './globals.css'

// Используем системные шрифты вместо Google Fonts для Docker
const inter = { className: 'font-sans' }

export const metadata: Metadata = {
  title: 'M2 | Платформа аренды недвижимости',
  description: 'Современная платформа для поиска и аренды недвижимости',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}