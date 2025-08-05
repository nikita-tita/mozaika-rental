'use client'

import { useEffect, useState } from 'react'
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
  ArrowRight,
  Shield,
  Zap,
  Target,
  BarChart3,
  Clock,
  DollarSign
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { useApp } from '@/components/providers/AppProvider'


interface DashboardStats {
  properties: number
  clients: number
  deals: number
  contracts: number
  payments: number
  notifications: number
  totalRevenue: number
  pendingPayments: number
}

interface RecentActivity {
  id: string
  type: 'property' | 'client' | 'deal' | 'payment' | 'contract'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
}

const dealMechanisms = [
  {
    id: 'contracts',
    title: 'Конструктор договоров',
    description: 'Создание профессиональных договоров аренды с автоматическим заполнением данных клиентов и объектов',
    icon: FileText,
    color: 'blue',
    href: '/contracts',
    features: ['Автоматическое заполнение', 'Юридические шаблоны', 'Экспорт в PDF'],
    status: 'active'
  },
  {
    id: 'scoring',
    title: 'Скоринг арендаторов',
    description: 'Оценка надежности потенциальных арендаторов на основе различных критериев и проверок',
    icon: Calculator,
    color: 'green',
    href: '/scoring',
    features: ['Проверка кредитной истории', 'Анализ доходов', 'Оценка рисков'],
    status: 'active'
  },
  {
    id: 'multilisting',
    title: 'Мультилистинг',
    description: 'Размещение объектов на всех популярных площадках одновременно для максимального охвата',
    icon: TrendingUp,
    color: 'purple',
    href: '/multilisting',
    features: ['Автоматическое размещение', 'Синхронизация данных', 'Аналитика просмотров'],
    status: 'active'
  },
  {
    id: 'signature',
    title: 'Электронная подпись',
    description: 'Безопасное подписание документов в электронном виде с юридической силой',
    icon: FileSignature,
    color: 'orange',
    href: '/signature',
    features: ['Юридическая сила', 'Безопасность', 'Быстрое подписание'],
    status: 'active'
  },
  {
    id: 'insurance',
    title: 'Страхование',
    description: 'Комплексное страхование объектов недвижимости и ответственности арендодателей',
    icon: Shield,
    color: 'red',
    href: '/insurance',
    features: ['Страхование имущества', 'Страхование ответственности', 'Быстрое оформление'],
    status: 'active'
  },
  {
    id: 'yandex-rental',
    title: 'M² x Яндекс.Аренда',
    description: 'Интеграция с Яндекс.Аренда для автоматического размещения объектов и управления бронированиями',
    icon: ExternalLink,
    color: 'yellow',
    href: '/yandex-rental',
    features: ['Автоматическая синхронизация', 'Управление бронированиями', 'Аналитика'],
    status: 'beta'
  }
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 border-blue-200 text-blue-700'
    case 'green':
      return 'bg-green-50 border-green-200 text-green-700'
    case 'purple':
      return 'bg-purple-50 border-purple-200 text-purple-700'
    case 'orange':
      return 'bg-orange-50 border-orange-200 text-orange-700'
    case 'red':
      return 'bg-red-50 border-red-200 text-red-700'
    case 'yellow':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700'
  }
}

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useApp()
  const [stats, setStats] = useState<DashboardStats>({
    properties: 0,
    clients: 0,
    deals: 0,
    contracts: 0,
    payments: 0,
    notifications: 0,
    totalRevenue: 0,
    pendingPayments: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    try {
      setIsLoadingStats(true)
      
      // Получаем статистику
      const statsResponse = await fetch('/api/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // Получаем последнюю активность
      const activityResponse = await fetch('/api/dashboard/activity')
      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.data)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных dashboard:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Building2 className="h-5 w-5" />
      case 'client':
        return <Users className="h-5 w-5" />
      case 'deal':
        return <TrendingUp className="h-5 w-5" />
      case 'payment':
        return <CreditCard className="h-5 w-5" />
      case 'contract':
        return <FileText className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  if (loading || isLoadingStats) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-responsive-sm sm:px-responsive-md lg:px-responsive-lg">
        {/* Header */}
        <div className="mb-responsive-lg sm:mb-responsive-xl">
          <h1 className="text-responsive-h2 font-bold text-gray-900">
            Панель управления
          </h1>
          <p className="mt-responsive-sm text-sm sm:text-base text-gray-500">
            Добро пожаловать, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Main Content */}
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive-md sm:gap-responsive-lg mb-responsive-lg sm:mb-responsive-xl">
            <TeamsCard className="p-responsive-md sm:p-responsive-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div className="ml-responsive-sm sm:ml-responsive-md">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Объекты</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.properties}</p>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard className="p-responsive-md sm:p-responsive-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-responsive-sm sm:ml-responsive-md">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Клиенты</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.clients}</p>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard className="p-responsive-md sm:p-responsive-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div className="ml-responsive-sm sm:ml-responsive-md">
                  <p className="text-sm font-medium text-gray-500">Сделки</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.deals}</p>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard className="p-responsive-md sm:p-responsive-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
                <div className="ml-responsive-sm sm:ml-responsive-md">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Доход</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </TeamsCard>
          </div>

          {/* Quick Actions */}
          <div className="mb-responsive-lg sm:mb-responsive-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-responsive-md">
              Быстрые действия
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-responsive-md sm:gap-responsive-lg">
                              <Link href="/properties/new">
                  <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer p-responsive-md sm:p-responsive-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-500 p-2 sm:p-3 rounded-lg">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="ml-responsive-sm sm:ml-responsive-md">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">Добавить объект</h3>
                      <p className="text-gray-600">Создать новое объявление</p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>

              <Link href="/clients/new">
                <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer p-responsive-md sm:p-responsive-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-2 sm:p-3 rounded-lg">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="ml-responsive-sm sm:ml-responsive-md">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">Добавить клиента</h3>
                      <p className="text-gray-600">Новый клиент в базе</p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>

              <Link href="/contracts/new">
                <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer p-responsive-md sm:p-responsive-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-500 p-2 sm:p-3 rounded-lg">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="ml-responsive-sm sm:ml-responsive-md">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">Создать договор</h3>
                      <p className="text-gray-600">Новый договор аренды</p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-responsive-lg sm:mb-responsive-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-responsive-md">
              Последняя активность
            </h2>
            <TeamsCard className="p-responsive-md sm:p-responsive-lg">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className={`flex-shrink-0 ${getActivityColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Пока нет активности</p>
                </div>
              )}
            </TeamsCard>
          </div>

          {/* Deal Mechanisms */}
          <div className="mb-responsive-lg sm:mb-responsive-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-responsive-md">
              Сделочные механизмы
            </h2>
            <p className="text-gray-600 mb-responsive-md sm:mb-responsive-lg">
              Инструменты для эффективной работы с арендой недвижимости
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-responsive-md sm:gap-responsive-lg">
              {dealMechanisms.map((mechanism) => {
                const Icon = mechanism.icon
                return (
                  <Link key={mechanism.id} href={mechanism.href}>
                    <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer h-full p-responsive-md sm:p-responsive-lg">
                      <div>
                        <div className="flex items-center mb-responsive-md">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getColorClasses(mechanism.color)} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="ml-responsive-sm sm:ml-responsive-md">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {mechanism.title}
                            </h3>
                            {mechanism.status === 'beta' && (
                              <TeamsBadge variant="warning" className="text-xs">Бета</TeamsBadge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm sm:text-base text-gray-600 mb-responsive-md leading-relaxed">
                          {mechanism.description}
                        </p>
                        
                        <div className="space-y-responsive-xs sm:space-y-responsive-sm mb-responsive-md">
                          {mechanism.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs sm:text-sm text-gray-500">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-responsive-xs sm:mr-responsive-sm" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-primary-600 text-xs sm:text-sm font-medium">
                          Открыть
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-responsive-xs sm:ml-responsive-sm" />
                        </div>
                      </div>
                    </TeamsCard>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
  )
} 