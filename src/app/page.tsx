'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TeamsButton, TeamsCard, TeamsBadge } from '@/components/ui/teams'
import { 
  Users, 
  Home, 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  Shield,
  Zap
} from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'
import { PublicLayout } from '@/components/layout/PublicLayout'

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { isAuthenticated, user } = useApp()
  const [activeTab, setActiveTab] = useState('clients')

  // Логирование состояния для отладки
  useEffect(() => {
    console.log('🏠 HomePage: Состояние изменилось')
    console.log('🏠 HomePage: isAuthenticated:', isAuthenticated)
    console.log('🏠 HomePage: user:', user)
  }, [isAuthenticated, user])

  const stats = [
    { label: 'Активных риелторов', value: '2,847', icon: Users },
    { label: 'Среднее ускорение сделок', value: '8x', icon: Zap },
    { label: 'Точность проверки', value: '99.7%', icon: Shield },
    { label: 'Средний прирост дохода', value: '1,5x', icon: TrendingUp }
  ]

  const features = [
    {
      title: 'Мои клиенты',
      description: 'Управление базой клиентов и их данными',
      icon: Users,
      href: '/clients',
      color: 'blue'
    },
    {
      title: 'Мои объекты',
      description: 'Своя база объектов недвижимости',
      icon: Home,
      href: '/properties',
      color: 'green'
    },
    {
      title: 'Сервисы для аренды',
      description: 'Все инструменты для работы с клиентами на любом этапе сделки с арендой',
      icon: Building2,
      href: '/mosaic',
      color: 'purple'
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
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  console.log('🏠 HomePage: Рендер, isAuthenticated:', isAuthenticated)

  // Если пользователь авторизован, перенаправляем на защищенную главную страницу
  if (isAuthenticated && user) {
    // Используем useEffect для редиректа, чтобы избежать ошибок гидратации
    useEffect(() => {
      window.location.href = '/home'
    }, [])
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Перенаправление...</p>
        </div>
      </div>
    )
  }

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Сделка сложится как по нотам
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Профессиональные инструменты для упрощения работы с клиентами и объектами недвижимости
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <TeamsButton size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                    Попробовать демо
                  </TeamsButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Основные возможности
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Все необходимые инструменты для эффективной работы с недвижимостью
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Link key={index} href={feature.href}>
                    <TeamsCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${getColorClasses(feature.color)} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {feature.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-primary-600 text-sm font-medium">
                        Подробнее
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </TeamsCard>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Готовы начать?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам риелторов, которые уже используют M² для упрощения своей работы
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/register">
                <TeamsButton size="lg" variant="secondary" className="w-full sm:w-auto">
                  Начать бесплатно
                </TeamsButton>
              </Link>
              <Link href="/login">
                <TeamsButton size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
                  Войти в систему
                </TeamsButton>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}