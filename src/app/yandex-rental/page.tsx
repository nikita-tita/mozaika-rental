'use client'

import { TeamsCard, TeamsButton } from '@/components/ui/teams'
import { ExternalLink, AlertCircle } from 'lucide-react'

export default function YandexRentalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            M² x Яндекс.Аренда
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Интеграция с Яндекс.Аренда для автоматического размещения объектов недвижимости
          </p>
        </div>

        {/* Beta Warning */}
        <div className="mb-8">
          <TeamsCard className="border-yellow-200 bg-yellow-50">
            <div className="flex items-center p-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Бета-версия</h3>
                <p className="text-yellow-700">
                  Данный сервис находится в разработке. Функционал будет доступен в ближайшее время.
                </p>
              </div>
            </div>
          </TeamsCard>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <TeamsCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Автоматическое размещение</h3>
              <p className="text-gray-600 mb-4">
                Размещайте объекты на Яндекс.Аренда одним кликом с автоматической синхронизацией данных
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Автозаполнение всех полей</li>
                <li>• Синхронизация фотографий</li>
                <li>• Обновление статуса</li>
                <li>• Управление ценами</li>
              </ul>
            </div>
          </TeamsCard>

          <TeamsCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Аналитика и статистика</h3>
              <p className="text-gray-600 mb-4">
                Получайте детальную статистику по просмотрам, звонкам и заявкам с Яндекс.Аренда
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Количество просмотров</li>
                <li>• Статистика звонков</li>
                <li>• Конверсия заявок</li>
                <li>• Сравнение с конкурентами</li>
              </ul>
            </div>
          </TeamsCard>
        </div>

        {/* Coming Soon */}
        <div className="text-center">
          <TeamsCard className="max-w-md mx-auto">
            <div className="p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Скоро будет доступно
              </h3>
              <p className="text-gray-600 mb-6">
                Мы работаем над интеграцией с Яндекс.Аренда. Оставьте заявку, чтобы узнать о запуске первым.
              </p>
              <TeamsButton className="w-full" disabled>
                Оставить заявку
              </TeamsButton>
            </div>
          </TeamsCard>
        </div>
      </div>
    </div>
  )
} 