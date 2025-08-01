'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus, Home, Calendar, FileText, Settings, LogOut, CreditCard } from 'lucide-react'
import { NotificationBell } from '@/components/notifications/NotificationBell'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    contracts: 0
  })

  useEffect(() => {
    // Здесь можно загрузить данные пользователя из API
    // Пока используем моковые данные
    setUser({
      id: '1',
      email: 'user@example.com',
      firstName: 'Иван',
      lastName: 'Петров',
      role: 'LANDLORD'
    })

    setStats({
      properties: 3,
      bookings: 5,
      contracts: 2
    })
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                M²
              </Link>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className="text-primary-600 border-b-2 border-primary-600 px-1 pt-1 pb-4 text-sm font-medium"
                >
                  Панель управления
                </Link>
                <Link
                  href="/properties"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium"
                >
                  Недвижимость
                </Link>
                <Link
                  href="/bookings"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium"
                >
                  Бронирования
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Добро пожаловать, {user.firstName}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Управляйте своей недвижимостью и отслеживайте бронирования
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Home className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Объектов недвижимости
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.properties}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Активных бронирований
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.bookings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Договоров аренды
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.contracts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Быстрые действия
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {user.role === 'LANDLORD' && (
                <Link href="/properties/new">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить недвижимость
                  </Button>
                </Link>
              )}
              
              <Link href="/properties">
                <Button className="w-full justify-start" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Просмотреть недвижимость
                </Button>
              </Link>
              
              <Link href="/bookings">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Мои бронирования
                </Button>
              </Link>
              
              <Link href="/contracts">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Договоры аренды
                </Button>
              </Link>
              
              <Link href="/payments">
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Платежи
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Настройки профиля
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Последняя активность
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span>Новое бронирование квартиры на ул. Ленина, 15</span>
                <span className="ml-auto text-gray-400">2 часа назад</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Обновлена информация о доме на ул. Пушкина, 22</span>
                <span className="ml-auto text-gray-400">1 день назад</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Подписан договор аренды студии в центре города</span>
                <span className="ml-auto text-gray-400">3 дня назад</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}