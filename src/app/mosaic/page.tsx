'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsBadge 
} from '@/components/ui/teams'
import { 
  FileSignature, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Calculator,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  status: 'active' | 'beta' | 'coming-soon'
  features: string[]
}

const services: Service[] = [
  {
    id: 'contract-builder',
    title: 'Конструктор договоров',
    description: 'Создание профессиональных договоров аренды с автоматическим заполнением данных',
    icon: FileSignature,
    href: '/contracts',
    status: 'active',
    features: [
      'Шаблоны договоров',
      'Автозаполнение данных',
      'Электронная подпись',
      'Экспорт в PDF/Word'
    ]
  },
  {
    id: 'tenant-scoring',
    title: 'Скоринг арендаторов',
    description: 'Оценка надежности потенциальных арендаторов на основе различных критериев',
    icon: Calculator,
    href: '/scoring',
    status: 'active',
    features: [
      'Анализ кредитной истории',
      'Проверка доходов',
      'Оценка рисков',
      'Рекомендации'
    ]
  },
  {
    id: 'property-inventory',
    title: 'Опись имущества',
    description: 'Создание детальной описи имущества с фотографиями и оценкой состояния',
    icon: Layers,
    href: '/inventory',
    status: 'beta',
    features: [
      'Фотофиксация',
      'Оценка состояния',
      'Акт приема-передачи',
      'Цифровой архив'
    ]
  },
  {
    id: 'digital-signature',
    title: 'Электронная подпись',
    description: 'Безопасное подписание документов в электронном виде',
    icon: FileSignature,
    href: '/signature',
    status: 'active',
    features: [
      'Юридическая сила',
      'Быстрое подписание',
      'Аудит подписей',
      'Уведомления'
    ]
  },
  {
    id: 'multilisting',
    title: 'Мультилистинг',
    description: 'Размещение объектов на всех популярных площадках одновременно',
    icon: TrendingUp,
    href: '/multilisting',
    status: 'active',
    features: [
      'Автопостинг',
      'Синхронизация',
      'Статистика',
      'Управление объявлениями'
    ]
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    description: 'Подробная аналитика по сделкам, клиентам и эффективности работы',
    icon: BarChart3,
    href: '/analytics',
    status: 'active',
    features: [
      'Дашборды',
      'Отчеты',
      'Прогнозирование',
      'KPI метрики'
    ]
  }
]

const getStatusBadge = (status: Service['status']) => {
  switch (status) {
    case 'active':
      return <TeamsBadge variant="success" className="text-xs">Активен</TeamsBadge>
    case 'beta':
      return <TeamsBadge variant="warning" className="text-xs">Бета</TeamsBadge>
    case 'coming-soon':
      return <TeamsBadge variant="default" className="text-xs">Скоро</TeamsBadge>
  }
}

export default function MosaicPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Сервисы для аренды
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Полный набор профессиональных инструментов для эффективной работы с арендой недвижимости
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">6</div>
            <div className="text-sm text-gray-600">Активных сервисов</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3x</div>
            <div className="text-sm text-gray-600">Ускорение работы</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Надежность</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">2.5x</div>
            <div className="text-sm text-gray-600">Рост доходов</div>
          </div>
        </div>

        {/* Сервисы */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <TeamsCard key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  {getStatusBadge(service.status)}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link href={service.href}>
                  <TeamsButton className="w-full">
                    Открыть сервис
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </TeamsButton>
                </Link>
              </TeamsCard>
            )
          })}
        </div>
      </div>
    </div>
  )
} 