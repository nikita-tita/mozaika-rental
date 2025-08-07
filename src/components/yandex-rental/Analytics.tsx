'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsBadge,
  TeamsSelect
} from '@/components/ui/teams'

interface AnalyticsData {
  totalLeads: number
  completedDeals: number
  totalEarnings: number
  avgTimeToRent: number
  conversionRate: number
  monthlyStats: {
    month: string
    leads: number
    deals: number
    earnings: number
  }[]
  statusDistribution: {
    status: string
    count: number
    percentage: number
  }[]
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalLeads: 0,
    completedDeals: 0,
    totalEarnings: 0,
    avgTimeToRent: 0,
    conversionRate: 0,
    monthlyStats: [],
    statusDistribution: []
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30') // дни

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/yandex-rental/analytics?period=${period}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Ошибка при загрузке аналитики:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    // Здесь будет экспорт данных в CSV/Excel
    console.log('Экспорт данных')
  }

  if (isLoading) {
    return (
      <TeamsCard className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка аналитики...</p>
        </div>
      </TeamsCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Аналитика Яндекс.Аренда
          </h2>
          <p className="text-gray-600">
            Статистика по переданным лидам и заработанным комиссиям
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7">7 дней</option>
            <option value="30">30 дней</option>
            <option value="90">90 дней</option>
            <option value="365">Год</option>
          </select>
          <TeamsButton
            variant="outline"
            onClick={fetchAnalytics}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </TeamsButton>
          <TeamsButton
            variant="outline"
            onClick={exportData}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </TeamsButton>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <TeamsCard className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.totalLeads}
          </div>
          <div className="text-sm text-gray-600">Всего лидов</div>
        </TeamsCard>

        <TeamsCard className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.completedDeals}
          </div>
          <div className="text-sm text-gray-600">Завершённых сделок</div>
        </TeamsCard>

        <TeamsCard className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.conversionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Конверсия</div>
        </TeamsCard>

        <TeamsCard className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.totalEarnings.toLocaleString()} ₽
          </div>
          <div className="text-sm text-gray-600">Общий заработок</div>
        </TeamsCard>

        <TeamsCard className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.avgTimeToRent}
          </div>
          <div className="text-sm text-gray-600">Ср. время до сдачи (дн.)</div>
        </TeamsCard>
      </div>

      {/* Графики и детальная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Распределение по статусам */}
        <TeamsCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Распределение по статусам
          </h3>
          <div className="space-y-3">
            {data.statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ 
                      backgroundColor: getStatusColor(item.status)
                    }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TeamsCard>

        {/* Месячная статистика */}
        <TeamsCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Месячная статистика
          </h3>
          <div className="space-y-3">
            {data.monthlyStats.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {month.month}
                  </div>
                  <div className="text-xs text-gray-500">
                    {month.leads} лидов, {month.deals} сделок
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary-600">
                    {month.earnings.toLocaleString()} ₽
                  </div>
                  <div className="text-xs text-gray-500">
                    комиссия
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TeamsCard>
      </div>

      {/* Дополнительная аналитика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Средняя комиссия */}
        <TeamsCard className="p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-2">
            {data.totalLeads > 0 
              ? (data.totalEarnings / data.totalLeads).toLocaleString() 
              : '0'} ₽
          </div>
          <div className="text-sm text-gray-600">Средняя комиссия за лид</div>
        </TeamsCard>

        {/* Эффективность */}
        <TeamsCard className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {data.completedDeals > 0 
              ? (data.totalEarnings / data.completedDeals).toLocaleString() 
              : '0'} ₽
          </div>
          <div className="text-sm text-gray-600">Средняя комиссия за сделку</div>
        </TeamsCard>

        {/* Прогноз */}
        <TeamsCard className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {Math.round(data.totalLeads * (data.conversionRate / 100) * (data.totalEarnings / Math.max(data.completedDeals, 1))).toLocaleString()} ₽
          </div>
          <div className="text-sm text-gray-600">Прогноз заработка</div>
        </TeamsCard>
      </div>

      {/* Информационный блок */}
      <TeamsCard className="p-6 border-blue-200 bg-blue-50">
        <div className="flex items-start">
          <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              О метриках
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Конверсия:</strong> процент лидов, которые привели к сделке</li>
              <li>• <strong>Среднее время до сдачи:</strong> количество дней от передачи лида до заселения</li>
              <li>• <strong>Прогноз заработка:</strong> ожидаемый доход на основе текущих показателей</li>
              <li>• <strong>Статистика обновляется</strong> в реальном времени</li>
            </ul>
          </div>
        </div>
      </TeamsCard>
    </div>
  )
}

// Вспомогательные функции
function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    'SUBMITTED': '#6B7280',
    'CALLED_OWNER': '#3B82F6',
    'PHOTO_SCHEDULED': '#F59E0B',
    'PUBLISHED': '#10B981',
    'FIRST_SHOWING': '#8B5CF6',
    'CONTRACT_SIGNED': '#6366F1',
    'OCCUPIED': '#059669',
    'FAILED': '#EF4444'
  }
  return colors[status] || '#6B7280'
}

function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    'SUBMITTED': 'Принят',
    'CALLED_OWNER': 'Созвон с собственником',
    'PHOTO_SCHEDULED': 'Запланирована фотосессия',
    'PUBLISHED': 'Объявление опубликовано',
    'FIRST_SHOWING': 'Первый показ',
    'CONTRACT_SIGNED': 'Договор подписан',
    'OCCUPIED': 'Заселён',
    'FAILED': 'Сделка не состоялась'
  }
  return labels[status] || status
} 