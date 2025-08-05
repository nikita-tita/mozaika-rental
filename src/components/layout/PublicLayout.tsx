import { ReactNode } from 'react'
import Link from 'next/link'
import { TeamsButton } from '@/components/ui/teams'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M²</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Сервисы для аренды</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Главная
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Возможности
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                О нас
              </Link>
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <TeamsButton variant="outline" size="sm">
                  Войти
                </TeamsButton>
              </Link>
              <Link href="/register">
                <TeamsButton size="sm">
                  Регистрация
                </TeamsButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
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
  )
} 