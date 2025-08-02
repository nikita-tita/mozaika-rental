'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, Building2 } from 'lucide-react'

interface HeaderProps {
  showNav?: boolean
}

export default function Header({ showNav = true }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        setUser(userData)
      } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUser(null)
    router.push('/login')
  }

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Дашборд', href: '/dashboard' },
    { name: 'Объекты', href: '/properties' },
    { name: 'Договоры', href: '/contracts' },
    { name: 'Бронирования', href: '/bookings' },
    { name: 'Платежи', href: '/payments' },
    { name: 'Уведомления', href: '/notifications' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-accent-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-900">M²</h1>
                <p className="text-xs text-primary-600">Технологии для риелторов</p>
              </div>
            </Link>
          </div>

          {/* Навигация для десктопа */}
          {showNav && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-700 hover:text-brand-600 transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-primary-900">{user.name}</p>
                  <p className="text-xs text-primary-600">{user.role === 'REALTOR' ? 'Риелтор' : 'Администратор'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-primary-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Выйти</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-primary-700 hover:text-brand-600 transition-colors font-medium"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Мобильное меню */}
            {showNav && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-primary-700 hover:text-brand-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && showNav && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-700 hover:text-brand-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-primary-900">{user.name}</p>
                      <p className="text-xs text-primary-600">{user.role === 'REALTOR' ? 'Риелтор' : 'Администратор'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 