'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/components/providers/AppProvider'

export default function TestAuthPage() {
  const { user, isAuthenticated, loading } = useApp()
  const [authStatus, setAuthStatus] = useState<string>('Проверка...')

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        const data = await response.json()
        setAuthStatus(`API ответ: ${JSON.stringify(data, null, 2)}`)
      } catch (error) {
        setAuthStatus(`Ошибка: ${error}`)
      }
    }

    checkAuthStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Тест авторизации</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Состояние AppProvider:</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Да' : 'Нет'}</p>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'Да' : 'Нет'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Нет'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API /auth/me:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {authStatus}
          </pre>
        </div>

        <div className="mt-6">
          <a href="/login" className="text-blue-600 hover:underline">
            Перейти на страницу входа
          </a>
        </div>
      </div>
    </div>
  )
} 