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
    { name: 'Мозаика', href: '/mosaic' },
  ]

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#007fff] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">M²</h1>
                <p className="text-xs text-gray-400">Технологии для риелторов</p>
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
                  className="text-gray-300 hover:text-[#00ff88] transition-colors font-medium"
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
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role === 'REALTOR' ? 'Риелтор' : 'Администратор'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Выйти</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-[#00ff88] transition-colors font-medium"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#00ff88] to-[#007fff] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Мобильное меню */}
            {showNav && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-[#00ff88] transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && showNav && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-[#00ff88] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.role === 'REALTOR' ? 'Риелтор' : 'Администратор'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 transition-colors"
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