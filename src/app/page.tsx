'use client'

import Link from 'next/link'
import { 
  Building2, 
  Users, 
  FileText, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Star,
  Calendar,
  CreditCard
} from 'lucide-react'
import { TeamsButton } from '@/components/ui/teams'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { useCommonTranslations } from '@/lib/i18n/hooks'

export default function HomePage() {
  const t = useCommonTranslations()

  const features = [
    {
      icon: Building2,
      title: 'Управление недвижимостью',
      description: 'Создавайте и управляйте объявлениями о недвижимости с полным контролем над процессом'
    },
    {
      icon: Users,
      title: 'Работа с клиентами',
      description: 'Ведите базу клиентов, отслеживайте взаимодействия и управляйте сделками'
    },
    {
      icon: FileText,
      title: 'Договоры и документы',
      description: 'Создавайте профессиональные договоры аренды с автоматическим заполнением данных'
    },
    {
      icon: Shield,
      title: 'Страхование',
      description: 'Комплексное страхование объектов недвижимости и ответственности арендодателей'
    },
    {
      icon: TrendingUp,
      title: 'Аналитика и отчеты',
      description: 'Получайте детальную аналитику по всем сделкам и финансовым показателям'
    },
    {
      icon: CheckCircle,
      title: 'Автоматизация',
      description: 'Автоматизируйте рутинные задачи и сосредоточьтесь на важном'
    }
  ]

  const stats = [
    { label: 'Активных объектов', value: '1,234', icon: Building2 },
    { label: 'Довольных клиентов', value: '5,678', icon: Users },
    { label: 'Успешных сделок', value: '2,345', icon: CheckCircle },
    { label: 'Средний рейтинг', value: '4.9/5', icon: Star }
  ]

  return (
    <PublicLayout>
      <div className="min-h-screen">
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
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="h-8 w-8 text-[#0078d4]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Все необходимое для успешной работы
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                M² предоставляет полный набор инструментов для эффективного управления недвижимостью
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#deecf9] p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-[#0078d4]" />
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-[#0078d4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Готовы начать?
            </h2>
            <p className="text-lg text-[#deecf9] mb-8 max-w-2xl mx-auto">
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