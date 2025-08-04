'use client'

import { useState } from 'react'
import { 
  ExternalLink, 
  Sync, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Settings,
  Zap,
  TrendingUp,
  Users,
  Building2
} from 'lucide-react'
import { TeamsCard, TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const features = [
  {
    icon: Sync,
    title: 'Автоматическая синхронизация',
    description: 'Ваши объекты автоматически появляются на Яндекс.Аренда в течение 5 минут'
  },
  {
    icon: BarChart3,
    title: 'Аналитика просмотров',
    description: 'Детальная статистика по просмотрам, звонкам и заявкам с Яндекс.Аренда'
  },
  {
    icon: Calendar,
    title: 'Управление бронированиями',
    description: 'Централизованное управление всеми бронированиями в одном месте'
  },
  {
    icon: MessageSquare,
    title: 'Единый чат',
    description: 'Все сообщения от арендаторов в одном интерфейсе'
  }
]

const benefits = [
  {
    icon: TrendingUp,
    title: 'Увеличение охвата',
    description: 'Доступ к миллионам пользователей Яндекс.Аренда'
  },
  {
    icon: Clock,
    title: 'Экономия времени',
    description: 'Автоматическое размещение без дублирования информации'
  },
  {
    icon: DollarSign,
    title: 'Больше доходов',
    description: 'Увеличение количества арендаторов и сделок'
  },
  {
    icon: Users,
    title: 'Качественные клиенты',
    description: 'Проверенные арендаторы с Яндекс.Аренда'
  }
]

const integrationSteps = [
  {
    step: 1,
    title: 'Подключение аккаунта',
    description: 'Авторизуйтесь через Яндекс.Аккаунт и предоставьте доступ к вашему профилю арендодателя'
  },
  {
    step: 2,
    title: 'Настройка синхронизации',
    description: 'Выберите объекты для автоматического размещения и настройте параметры'
  },
  {
    step: 3,
    title: 'Активация интеграции',
    description: 'Подтвердите настройки и активируйте автоматическую синхронизацию'
  }
]

export default function YandexRentalPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    // Имитация подключения
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
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
              Интеграция с Яндекс.Аренда для автоматического размещения объектов и управления бронированиями
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Функция находится в бета-тестировании
            </div>
          </div>

          {/* Beta Warning */}
          <div className="mb-8">
            <TeamsCard className="border-yellow-200 bg-yellow-50">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Бета-версия
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Эта интеграция находится в стадии тестирования. Некоторые функции могут работать нестабильно. 
                    Мы рекомендуем использовать её только для тестирования.
                  </p>
                </div>
              </div>
            </TeamsCard>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Возможности интеграции
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <TeamsCard key={index} className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </TeamsCard>
                )
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Преимущества интеграции
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <TeamsCard key={index} className="text-center p-6">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </TeamsCard>
                )
              })}
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-12">
            <TeamsCard className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {isConnected ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isConnected ? 'Интеграция активна' : 'Интеграция не подключена'}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {isConnected 
                    ? 'Ваш аккаунт успешно подключен к Яндекс.Аренда. Синхронизация активна.'
                    : 'Подключите свой аккаунт Яндекс.Аренда для начала интеграции.'
                  }
                </p>

                {!isConnected && (
                  <TeamsButton 
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Подключение...
                      </>
                    ) : (
                      <>
                        Подключить аккаунт
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </TeamsButton>
                )}

                {isConnected && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <TeamsButton variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Настройки
                    </TeamsButton>
                    <TeamsButton variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Отключить
                    </TeamsButton>
                  </div>
                )}
              </div>
            </TeamsCard>
          </div>

          {/* Integration Steps */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Как подключить интеграцию?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {integrationSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-600 font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Preview */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Статистика интеграции
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <TeamsCard className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Размещено объектов</div>
              </TeamsCard>
              
              <TeamsCard className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Просмотров</div>
              </TeamsCard>
              
              <TeamsCard className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Заявок</div>
              </TeamsCard>
              
              <TeamsCard className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Бронирований</div>
              </TeamsCard>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Готовы попробовать бета-версию?
            </h2>
            <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
              Присоединяйтесь к тестированию интеграции с Яндекс.Аренда и получите ранний доступ к новым возможностям
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TeamsButton size="lg" variant="secondary">
                Начать тестирование
                <Zap className="w-4 h-4 ml-2" />
              </TeamsButton>
              <TeamsButton size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Узнать больше
                <ExternalLink className="w-4 h-4 ml-2" />
              </TeamsButton>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Часто задаваемые вопросы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Что такое бета-версия?
                </h3>
                <p className="text-gray-600">
                  Бета-версия - это предварительная версия функции, которая находится в стадии тестирования. 
                  Могут быть недоступны некоторые возможности или возможны ошибки.
                </p>
              </TeamsCard>
              
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Безопасно ли подключать аккаунт?
                </h3>
                <p className="text-gray-600">
                  Да, интеграция использует официальное API Яндекс.Аренда и не имеет доступа к вашим личным данным.
                </p>
              </TeamsCard>
              
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Можно ли отключить интеграцию?
                </h3>
                <p className="text-gray-600">
                  Да, вы можете отключить интеграцию в любое время. Все ваши объекты останутся в системе M².
                </p>
              </TeamsCard>
              
              <TeamsCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Когда выйдет полная версия?
                </h3>
                <p className="text-gray-600">
                  Полная версия планируется к выпуску в ближайшие месяцы. Следите за обновлениями.
                </p>
              </TeamsCard>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 