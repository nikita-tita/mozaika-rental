'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Home, 
  Calendar, 
  FileText, 
  Settings, 
  CreditCard, 
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  AlertCircle,
  Calculator,
  FileSignature,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { useApp } from '@/components/providers/AppProvider'

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useApp()

  // Убираем useEffect, так как AppProvider уже загружает пользователя

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Проверяем авторизацию
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Требуется авторизация</h1>
          <p className="text-gray-600 mb-6">Для доступа к панели управления необходимо войти в систему</p>
          <Link href="/login">
            <TeamsButton>Войти в систему</TeamsButton>
          </Link>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Недвижимость',
      description: 'Управление объектами',
      icon: <Building2 className="h-6 w-6" />,
      href: '/properties',
      color: 'bg-blue-500'
    },
    {
      title: 'Сделки',
      description: 'Управление сделками',
      icon: <FileText className="h-6 w-6" />,
      href: '/deals',
      color: 'bg-green-500'
    },
    {
      title: 'Клиенты',
      description: 'База клиентов',
      icon: <Users className="h-6 w-6" />,
      href: '/clients',
      color: 'bg-purple-500'
    },
    {
      title: 'Платежи',
      description: 'Финансовые операции',
      icon: <CreditCard className="h-6 w-6" />,
      href: '/payments',
      color: 'bg-yellow-500'
    },
    {
      title: 'Договоры',
      description: 'Юридические документы',
      icon: <FileText className="h-6 w-6" />,
      href: '/contracts',
      color: 'bg-red-500'
    },
    {
      title: 'Аналитика',
      description: 'Отчеты и статистика',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/analytics',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Панель управления
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Добро пожаловать, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <TeamsBadge variant="success">
                {user?.role}
              </TeamsBadge>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TeamsCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Объекты</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Сделки</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Клиенты</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Доход</p>
                <p className="text-2xl font-semibold text-gray-900">₽2.4M</p>
              </div>
            </div>
          </TeamsCard>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center p-4">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Сервисы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/contracts">
              <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Конструктор</h3>
                      <TeamsBadge variant="success" className="text-xs">Активен</TeamsBadge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Создание профессиональных договоров аренды с автоматическим заполнением данных
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Открыть
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </TeamsCard>
            </Link>

            <Link href="/scoring">
              <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Скоринг</h3>
                      <TeamsBadge variant="success" className="text-xs">Активен</TeamsBadge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Оценка надежности потенциальных арендаторов на основе различных критериев
                  </p>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    Открыть
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </TeamsCard>
            </Link>

            <Link href="/signature">
              <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileSignature className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Электронная подпись</h3>
                      <TeamsBadge variant="success" className="text-xs">Активен</TeamsBadge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Безопасное подписание документов в электронном виде
                  </p>
                  <div className="flex items-center text-purple-600 text-sm font-medium">
                    Открыть
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </TeamsCard>
            </Link>

            <Link href="/multilisting">
              <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Мультилистинг</h3>
                      <TeamsBadge variant="success" className="text-xs">Активен</TeamsBadge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Размещение объектов на всех популярных площадках одновременно
                  </p>
                  <div className="flex items-center text-orange-600 text-sm font-medium">
                    Открыть
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </TeamsCard>
            </Link>

            <Link href="/yandex-rental">
              <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">M²xЯндексАренда</h3>
                      <TeamsBadge variant="warning" className="text-xs">Бета</TeamsBadge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Интеграция с Яндекс.Аренда для автоматического размещения объектов
                  </p>
                  <div className="flex items-center text-red-600 text-sm font-medium">
                    Открыть
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </TeamsCard>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Последние действия
          </h2>
          <TeamsCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Новая сделка создана</p>
                    <p className="text-sm text-gray-500">Квартира на Ленина, 15</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 часа назад</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium">Требуется подпись договора</p>
                    <p className="text-sm text-gray-500">Сделка #1234</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 день назад</span>
              </div>
              
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Платеж получен</p>
                    <p className="text-sm text-gray-500">₽150,000</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 дня назад</span>
              </div>
            </div>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 