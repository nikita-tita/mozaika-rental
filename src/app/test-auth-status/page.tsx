'use client'

import { useApp } from '@/components/providers/AppProvider'

export default function TestAuthStatusPage() {
  const { user, isAuthenticated, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Тест статуса авторизации
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Текущее состояние:</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Авторизован:</strong> {isAuthenticated ? '✅ Да' : '❌ Нет'}
            </div>
            
            {user && (
              <div>
                <strong>Пользователь:</strong>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
            
            <div>
              <strong>Загрузка:</strong> {loading ? '🔄 Да' : '✅ Нет'}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Действия:</h3>
            
            {!isAuthenticated ? (
              <div>
                <a 
                  href="/login" 
                  className="inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Войти
                </a>
              </div>
            ) : (
              <div className="space-x-4">
                <a 
                  href="/dashboard" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Перейти в Dashboard
                </a>
                <a 
                  href="/deals" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Перейти в Сделки
                </a>
                <a 
                  href="/clients" 
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Перейти в Клиенты
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 