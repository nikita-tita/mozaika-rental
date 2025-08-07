'use client'

import { useState } from 'react'
import { 
  ExternalLink, 
  Star,
  Plus,
  List,
  Settings,
  BarChart3
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge, TeamsTabs } from '@/components/ui/teams'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import OwnerContactForm from '@/components/yandex-rental/OwnerContactForm'
import LeadsFeed from '@/components/yandex-rental/LeadsFeed'
import ProgramInfo from '@/components/yandex-rental/ProgramInfo'
import CommissionSettings from '@/components/yandex-rental/CommissionSettings'
import Analytics from '@/components/yandex-rental/Analytics'



export default function YandexRentalPage() {
  const [activeTab, setActiveTab] = useState('form')

  const tabs = [
    {
      id: 'form',
      label: 'Передать контакт',
      icon: Plus,
      content: <OwnerContactForm />
    },
    {
      id: 'leads',
      label: 'Лента лидов',
      icon: List,
      content: <LeadsFeed />
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: BarChart3,
      content: <Analytics />
    },
    {
      id: 'settings',
      label: 'Настройки комиссий',
      icon: Settings,
      content: <CommissionSettings />
    },
    {
      id: 'info',
      label: 'О программе',
      icon: Star,
      content: <ProgramInfo />
    }
  ]

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
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                M² x Яндекс.Аренда
              </h1>
              <TeamsBadge variant="warning" className="ml-4">Бета</TeamsBadge>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Интеграция с Яндекс.Аренда для передачи контактов собственников и получения комиссии 72.5%
            </p>
          </div>

          {/* Tabs */}
          <TeamsTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-8"
          />

          {/* Tab Content */}
          <div className="mt-8">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 