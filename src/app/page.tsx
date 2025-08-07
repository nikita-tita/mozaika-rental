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
export const revalidate = 0

console.log('🏠 HomePage: Рендер, isAuthenticated:', false)

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
          <div className="max-w-7xl mx-auto px-responsive-sm sm:px-responsive-md lg:px-responsive-lg py-responsive-xl sm:py-responsive-2xl">
            <div className="text-center">

              
              <h1 className="text-responsive-h1 font-extrabold text-gray-900 mb-responsive-md sm:mb-responsive-lg leading-tight">
                Сделка сложится как по{' '}
                <span className="text-primary-600">нотам</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-responsive-lg sm:mb-responsive-xl max-w-4xl mx-auto px-responsive-sm leading-relaxed">
                Профессиональные инструменты для упрощения работы с клиентами и объектами недвижимости
              </p>
              
              <div className="flex flex-col sm:flex-row gap-responsive-sm sm:gap-responsive-md justify-center px-responsive-sm mb-responsive-xl">
                <Link href="/register" className="w-full sm:w-auto">
                  <TeamsButton size="xl" className="w-full sm:w-auto">
                    Попробовать демо
                  </TeamsButton>
                </Link>
                              <Link href="/login" className="w-full sm:w-auto">
                <TeamsButton variant="outline" size="xl" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50">
                  Войти в систему
                </TeamsButton>
              </Link>
              </div>
              
              {/* Дополнительная информация */}
              <div className="flex flex-wrap justify-center gap-responsive-md sm:gap-responsive-lg text-sm sm:text-base text-gray-500">
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
        <section className="py-responsive-xl sm:py-responsive-2xl bg-white">
          <div className="max-w-7xl mx-auto px-responsive-sm sm:px-responsive-md lg:px-responsive-lg">
            <div className="text-center mb-responsive-xl">
              <h2 className="text-responsive-h2 font-bold text-gray-900 mb-responsive-md">
                Доверяют профессионалы
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Тысячи риелторов уже используют M² для упрощения своей работы
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive-md sm:gap-responsive-lg">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <TeamsCard key={index} className="text-center p-responsive-md sm:p-responsive-lg hover:shadow-lg transition-all duration-300" interactive>
                    <div className="flex justify-center mb-responsive-md">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-responsive-sm">
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
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            
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

// Данные для статистики
const stats = [
  { icon: Users, value: '1,000+', label: 'Активных пользователей' },
  { icon: Home, value: '5,000+', label: 'Объектов в базе' },
  { icon: TrendingUp, value: '98%', label: 'Довольных клиентов' },
  { icon: Clock, value: '24/7', label: 'Поддержка' }
]

// Данные для функций
const features = [
  {
    title: 'Управление клиентами',
    description: 'Централизованная база клиентов с полной историей взаимодействий',
    icon: Users,
    href: '/clients',
    color: 'blue'
  },
  {
    title: 'База объектов',
    description: 'Удобное управление портфелем недвижимости с фото и документами',
    icon: Building2,
    href: '/properties',
    color: 'green'
  },
  {
    title: 'Аналитика сделок',
    description: 'Подробная статистика и отчеты по всем сделкам и активности',
    icon: TrendingUp,
    href: '/analytics',
    color: 'purple'
  }
]

// Функция для получения классов цветов
function getColorClasses(color: string) {
  const colorMap = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white'
  }
  return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 text-white'
}