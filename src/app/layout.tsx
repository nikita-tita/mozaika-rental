import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TeamsHeader, TeamsSidebar } from '@/components/ui/teams'
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
          <div className="min-h-screen flex flex-col">
            <TeamsHeader />
            <div className="flex flex-1">
              <TeamsSidebar />
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
            <footer className="bg-gray-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M²</span>
                      </div>
                      <span className="text-xl font-bold">Сервисы для аренды</span>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Профессиональные инструменты для упрощения работы риелторов с арендой недвижимости
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        О нас
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        Контакты
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        Поддержка
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Продукт</h3>
                    <ul className="space-y-2">
                      <li><a href="/clients" className="text-gray-400 hover:text-white transition-colors">Клиенты</a></li>
                      <li><a href="/properties" className="text-gray-400 hover:text-white transition-colors">Объекты</a></li>
                      <li><a href="/mosaic" className="text-gray-400 hover:text-white transition-colors">Сервисы</a></li>
                      <li><a href="/deals" className="text-gray-400 hover:text-white transition-colors">Сделки</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Документация</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Обратная связь</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                  <p className="text-gray-400">
                    © 2024 M². Все права защищены.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}