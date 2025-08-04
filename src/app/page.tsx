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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <TeamsButton size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                    Попробовать демо
                  </TeamsButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Все необходимые инструменты
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Полный набор функций для эффективной работы с арендой недвижимости
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <TeamsCard className="h-full p-4 sm:p-6 hover:shadow-lg transition-shadow flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 ${getColorClasses(feature.color)}`}>
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">{feature.title}</h3>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-1">{feature.description}</p>
                    
                    <div className="mt-auto">
                      {isAuthenticated ? (
                        <Link href={feature.href} className="block">
                          <TeamsButton className="w-full" variant="outline">
                            <span className="hidden sm:inline">Открыть</span>
                            <span className="sm:hidden">Открыть</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </TeamsButton>
                        </Link>
                      ) : (
                        <div className="relative">
                          {/* Заблюренный экран */}
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                            <div className="text-center p-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mb-3">Требуется авторизация</p>
                              <Link href="/login">
                                <TeamsButton size="sm" className="text-xs sm:text-sm">
                                  Войти
                                </TeamsButton>
                              </Link>
                            </div>
                          </div>
                          
                          {/* Заблюренная кнопка */}
                          <TeamsButton className="w-full opacity-50" variant="outline" disabled>
                            <span className="hidden sm:inline">Открыть</span>
                            <span className="sm:hidden">Открыть</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </TeamsButton>
                        </div>
                      )}
                    </div>
                  </div>
                </TeamsCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Почему выбирают нас
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Простота использования</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Интуитивно понятный интерфейс, который не требует обучения</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Экономия времени</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Автоматизация рутинных процессов и быстрый доступ к данным</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Рост доходов</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Увеличение количества сделок и улучшение качества обслуживания</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}