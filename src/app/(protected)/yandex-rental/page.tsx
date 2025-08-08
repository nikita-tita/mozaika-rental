'use client'

import { useState, useEffect } from 'react'
import { 
  ExternalLink, 
  Plus,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import OwnerContactForm from '@/components/yandex-rental/OwnerContactForm'
import LeadsFeed from '@/components/yandex-rental/LeadsFeed'

interface DashboardStats {
  totalLeads: number
  completedDeals: number
  totalEarnings: number
  conversionRate: number
}

export default function YandexRentalPage() {
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    completedDeals: 0,
    totalEarnings: 0,
    conversionRate: 0
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/yandex-rental/analytics?period=365')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalLeads: data.totalLeads || 0,
          completedDeals: data.completedDeals || 0,
          totalEarnings: data.totalEarnings || 0,
          conversionRate: data.conversionRate || 0
        })
      }
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
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
                    <DollarSign className="h-5 w-5 text-yellow-600" />
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
                    <XCircle className="w-5 h-5" />
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
    </ProtectedRoute>
  )
} 