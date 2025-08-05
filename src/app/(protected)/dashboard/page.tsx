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
      return 'bg-[#deecf9] border-[#0078d4] text-[#0078d4]'
    case 'green':
      return 'bg-[#dff6dd] border-[#107c10] text-[#107c10]'
    case 'purple':
      return 'bg-[#f3e5f5] border-[#5c2d91] text-[#5c2d91]'
    case 'orange':
      return 'bg-[#fce4ec] border-[#ca5010] text-[#ca5010]'
    case 'red':
      return 'bg-[#fde7e9] border-[#d13438] text-[#d13438]'
    case 'yellow':
      return 'bg-[#fff4ce] border-[#ca5010] text-[#ca5010]'
    default:
      return 'bg-[#f3f2f1] border-[#605e5c] text-[#605e5c]'
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
        return 'text-[#107c10]'
      case 'warning':
        return 'text-[#ca5010]'
      case 'info':
        return 'text-[#0078d4]'
      default:
        return 'text-[#605e5c]'
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
    <div>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#323130]">
            Панель управления
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#605e5c]">
            Добро пожаловать, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Main Content */}
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <TeamsCard>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-8 w-8 text-[#0078d4]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#605e5c]">Объекты</p>
                  <p className="text-2xl font-semibold text-[#323130]">{stats.properties}</p>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-[#107c10]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#605e5c]">Клиенты</p>
                  <p className="text-2xl font-semibold text-[#323130]">{stats.clients}</p>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-[#5c2d91]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#605e5c]">Сделки</p>
                  <p className="text-2xl font-semibold text-[#323130]">{stats.deals}</p>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-[#ca5010]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#605e5c]">Доход</p>
                  <p className="text-2xl font-semibold text-[#323130]">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </TeamsCard>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-3 sm:mb-4">
              Быстрые действия
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Link href="/properties/new">
                <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center p-4">
                    <div className="bg-[#0078d4] p-3 rounded-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-[#323130]">Добавить объект</h3>
                      <p className="text-gray-600">Создать новое объявление</p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>

              <Link href="/clients/new">
                <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center p-4">
                    <div className="bg-[#107c10] p-3 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-[#323130]">Добавить клиента</h3>
                      <p className="text-[#605e5c]">Новый клиент в базе</p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>

              <Link href="/contracts/new">
                <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center p-4">
                    <div className="bg-[#5c2d91] p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-[#323130]">Создать договор</h3>
                      <p className="text-[#605e5c]">Новый договор аренды</p>
                    </div>
                  </div>
                </TeamsCard>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-3 sm:mb-4">
              Последняя активность
            </h2>
            <TeamsCard>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className={`flex-shrink-0 ${getActivityColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-[#323130]">
                          {activity.title}
                        </p>
                        <p className="text-sm text-[#605e5c]">{activity.description}</p>
                      </div>
                      <div className="text-sm text-[#605e5c]">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-[#605e5c] mx-auto mb-4" />
                  <p className="text-[#605e5c]">Пока нет активности</p>
                </div>
              )}
            </TeamsCard>
          </div>

          {/* Deal Mechanisms */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#323130] mb-3 sm:mb-4">
              Сделочные механизмы
            </h2>
            <p className="text-[#605e5c] mb-4 sm:mb-6">
              Инструменты для эффективной работы с арендой недвижимости
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {dealMechanisms.map((mechanism) => {
                const Icon = mechanism.icon
                return (
                  <Link key={mechanism.id} href={mechanism.href}>
                    <TeamsCard className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${getColorClasses(mechanism.color)} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-[#323130]">
                              {mechanism.title}
                            </h3>
                            {mechanism.status === 'beta' && (
                              <TeamsBadge variant="warning" className="text-xs">Бета</TeamsBadge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-[#605e5c] mb-4 leading-relaxed">
                          {mechanism.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {mechanism.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-[#605e5c]">
                              <CheckCircle className="w-4 h-4 text-[#107c10] mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-[#0078d4] text-sm font-medium">
                          Открыть
                          <ArrowRight className="w-4 h-4 ml-1" />
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