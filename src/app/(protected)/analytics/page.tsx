'use client'

import { useState } from 'react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsSelect } from '@/components/ui/teams'
import { TrendingUp, BarChart3, PieChart, Calendar, DollarSign, Home, Users } from 'lucide-react'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month')

  const periodOptions = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'quarter', label: 'Квартал' },
    { value: 'year', label: 'Год' }
  ]

  const mockData = {
    totalIncome: 1250000,
    totalProperties: 8,
    activeTenants: 12,
    occupancyRate: 85,
    averageRent: 52000,
    growthRate: 12.5
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
            Аналитика и отчеты
          </h1>
          <p className="text-lg text-gray-600">
            Детальная аналитика доходности объектов и эффективности сделок
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-6">
          <TeamsSelect
            value={period}
            onChange={(value) => setPeriod(value)}
            options={periodOptions}
            placeholder="Выберите период"
            className="w-48"
          />
        </div>

        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TeamsCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Общий доход</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockData.totalIncome.toLocaleString()} ₽
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+{mockData.growthRate}%</span>
              <span className="text-gray-500 ml-1">с прошлого периода</span>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Объекты недвижимости</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.totalProperties}</p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-500">Активных объектов</span>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Арендаторы</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.activeTenants}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-500">Активных арендаторов</span>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Загрузка</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.occupancyRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-500">Средняя загрузка объектов</span>
            </div>
          </TeamsCard>
        </div>

        {/* Графики и диаграммы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Доходы по месяцам
            </h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">График доходов</p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Распределение по типам недвижимости
            </h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Круговая диаграмма</p>
              </div>
            </div>
          </TeamsCard>
        </div>

        {/* Детальная аналитика */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ объектов</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">2-к квартира, ул. Ленина, 1</span>
                <span className="font-semibold">45,000 ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Офис, ул. Пушкина, 10</span>
                <span className="font-semibold">120,000 ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">1-к квартира, ул. Гагарина, 5</span>
                <span className="font-semibold">35,000 ₽</span>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Эффективность</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Средняя арендная плата</span>
                <span className="font-semibold">{mockData.averageRent.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Средний срок аренды</span>
                <span className="font-semibold">11 мес</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Процент продления</span>
                <span className="font-semibold">78%</span>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Тенденции</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Рост доходов</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Новые объекты</span>
                <span className="font-semibold text-blue-600">+2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Средняя загрузка</span>
                <span className="font-semibold text-orange-600">85%</span>
              </div>
            </div>
          </TeamsCard>
        </div>

        {/* Действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamsCard className="p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ежемесячный отчет</h3>
            <p className="text-gray-600 mb-4">Детальный анализ доходов и расходов</p>
            <TeamsButton variant="outline" size="sm">
              Скачать PDF
            </TeamsButton>
          </TeamsCard>

          <TeamsCard className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Анализ эффективности</h3>
            <p className="text-gray-600 mb-4">Сравнение объектов по доходности</p>
            <TeamsButton variant="outline" size="sm">
              Скачать Excel
            </TeamsButton>
          </TeamsCard>

          <TeamsCard className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Прогнозы</h3>
            <p className="text-gray-600 mb-4">Прогнозирование доходов на будущее</p>
            <TeamsButton variant="outline" size="sm">
              Просмотреть
            </TeamsButton>
          </TeamsCard>

          <TeamsCard className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Налоговая отчетность</h3>
            <p className="text-gray-600 mb-4">Отчеты для налоговой инспекции</p>
            <TeamsButton variant="outline" size="sm">
              Сформировать
            </TeamsButton>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 