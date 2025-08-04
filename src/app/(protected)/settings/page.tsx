'use client'

import { useState, useEffect } from 'react'
import { TeamsCard, TeamsButton, TeamsInput, TeamsSelect } from '@/components/ui/teams'
import { useApp } from '@/components/providers/AppProvider'

// Отключаем предварительный рендеринг для этой страницы
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { user } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notifications: true,
    language: 'ru'
  })

  // Обновляем форму когда пользователь загружен
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        notifications: true,
        language: 'ru'
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Здесь будет API для обновления настроек
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Настройки успешно сохранены')
    } catch (error) {
      setMessage('Ошибка при сохранении настроек')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="mt-2 text-gray-600">
            Управление профилем и настройками аккаунта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основные настройки */}
          <div className="lg:col-span-2">
            <TeamsCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Профиль пользователя
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя
                    </label>
                    <TeamsInput
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Введите имя"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фамилия
                    </label>
                    <TeamsInput
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Введите фамилию"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <TeamsInput
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Введите email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <TeamsInput
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Введите телефон"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Язык интерфейса
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('успешно') 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="flex justify-end">
                  <TeamsButton
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </TeamsButton>
                </div>
              </form>
            </TeamsCard>
          </div>

          {/* Дополнительные настройки */}
          <div>
            <TeamsCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Уведомления
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Email уведомления
                    </p>
                    <p className="text-xs text-gray-500">
                      Получать уведомления на email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </TeamsCard>

            <TeamsCard className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Информация об аккаунте
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Роль</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Статус</p>
                  <p className="text-sm text-gray-600">
                    {user.verified ? 'Подтвержден' : 'Не подтвержден'}
                  </p>
                </div>
              </div>
            </TeamsCard>
          </div>
        </div>
      </div>
    </div>
  )
} 