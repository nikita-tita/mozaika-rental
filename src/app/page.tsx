'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TeamsButton, TeamsCard, TeamsBadge } from '@/components/ui/teams'
import { M2Logo } from '@/components/ui/M2Logo'
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
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="text-center">
              {/* Логотип */}
              <div className="flex justify-center mb-8">
                <M2Logo size="xl" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Сделка сложится как по{' '}
                <span className="text-primary-600">нотам</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-4xl mx-auto px-4 leading-relaxed">
                Профессиональные инструменты для упрощения работы с клиентами и объектами недвижимости
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 mb-12">
                <Link href="/register" className="w-full sm:w-auto">
                  <TeamsButton size="xl" className="w-full sm:w-auto">
                    Попробовать демо
                  </TeamsButton>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <TeamsButton variant="outline" size="xl" className="w-full sm:w-auto">
                    Войти в систему
                  </TeamsButton>
                </Link>
              </div>
              
              {/* Дополнительная информация */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-success-500" />
                  Бесплатно для начала
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-primary-500" />
                  Безопасно и надежно
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-warning-500" />
                  Быстрая настройка
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Доверяют профессионалы
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Тысячи риелторов уже используют M² для упрощения своей работы
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <TeamsCard key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300" interactive>
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {stat.label}
                    </div>
                  </TeamsCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
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
                    <TeamsCard className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer h-full" interactive>
                      <div className="flex items-start mb-6">
                        <div className={`w-16 h-16 ${getColorClasses(feature.color)} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-primary-600 font-semibold group">
                        Подробнее
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </TeamsCard>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
          {/* Фоновые элементы */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-90"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
              <M2Logo size="lg" variant="white" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Присоединяйтесь к тысячам риелторов, которые уже используют M² для упрощения своей работы
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8">
              <Link href="/register">
                <TeamsButton size="xl" variant="secondary" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100">
                  Начать бесплатно
                </TeamsButton>
              </Link>
              <Link href="/login">
                <TeamsButton size="xl" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
                  Войти в систему
                </TeamsButton>
              </Link>
            </div>
            
            {/* Дополнительная информация */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-primary-200">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Регистрация за 2 минуты
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Без скрытых платежей
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Мгновенный доступ
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}