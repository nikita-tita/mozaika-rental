'use client'

import { useState, useEffect } from 'react'
import { 
  Plus,
  Users,
  Banknote,
  CheckCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { TeamsCard, TeamsButton } from '@/components/ui/teams'
import OwnerContactForm from '@/components/yandex-rental/OwnerContactForm'
import LeadsFeed from '@/components/yandex-rental/LeadsFeed'

interface DashboardStats {
  totalLeads: number
  completedDeals: number
  totalEarnings: number
  conversionRate: number
  avgTimeToRent: number
  statusDistribution: Array<{
    status: string
    count: number
    percentage: number
  }>
  monthlyStats: Array<{
    month: string
    leads: number
    deals: number
    earnings: number
  }>
}

export default function YandexRentalPage() {
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    completedDeals: 0,
    totalEarnings: 0,
    conversionRate: 0,
    avgTimeToRent: 0,
    statusDistribution: [],
    monthlyStats: []
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/yandex-rental/analytics?period=365')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats({
            totalLeads: data.totalLeads || 0,
            completedDeals: data.completedDeals || 0,
            totalEarnings: data.totalEarnings || 0,
            conversionRate: data.conversionRate || 0,
            avgTimeToRent: data.avgTimeToRent || 0,
            statusDistribution: data.statusDistribution || [],
            monthlyStats: data.monthlyStats || []
          })
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            M² x Яндекс.Аренда
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Передавайте контакты собственников и получайте комиссию 72.5% от первого арендного платежа
          </p>
          <TeamsButton 
            onClick={() => setShowForm(true)}
            className="text-lg px-8 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Передать контакт собственника
          </TeamsButton>
        </div>

        {/* Мини-дашборд */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TeamsCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Всего лидов</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Успешных сделок</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedDeals}</p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Общий заработок</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEarnings.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Конверсия</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </TeamsCard>
        </div>

        {/* Дополнительная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TeamsCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Среднее время до сдачи</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgTimeToRent > 0 ? `${stats.avgTimeToRent} дн.` : 'Нет данных'}
                </p>
              </div>
            </div>
          </TeamsCard>

          <TeamsCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Активных лидов</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.statusDistribution.find(s => s.status === 'PUBLISHED')?.count || 0}
                </p>
              </div>
            </div>
          </TeamsCard>
        </div>

        {/* Форма передачи контакта */}
        {showForm && (
          <TeamsCard className="mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Передать контакт собственника
                </h2>
                <TeamsButton
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </TeamsButton>
              </div>
              <OwnerContactForm onSuccess={() => {
                setShowForm(false)
                fetchDashboardStats()
              }} />
            </div>
          </TeamsCard>
        )}

        {/* Лента лидов */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Переданные лиды
            </h2>
            <TeamsButton
              variant="outline"
              onClick={fetchDashboardStats}
              className="text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </TeamsButton>
          </div>
          <LeadsFeed onUpdate={fetchDashboardStats} />
        </div>
      </div>
    </div>
  )
} 