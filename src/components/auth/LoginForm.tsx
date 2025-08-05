'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TeamsButton } from '@/components/ui/teams/TeamsButton'
import { TeamsInput } from '@/components/ui/teams/TeamsInput'
import { TeamsCard } from '@/components/ui/teams/TeamsCard'
import { M2Logo } from '@/components/ui/M2Logo'
import { useApp } from '@/components/providers/AppProvider'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const { login, checkAuth } = useApp()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Очищаем ошибку при изменении поля
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Попытка входа для:', formData.email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Авторизация успешна, обновляем состояние')
        
        // Обновляем состояние приложения
        login(data.data)
        
        console.log('🔄 Перенаправление на home')
        
        // Принудительное перенаправление на home
        window.location.href = '/home'
      } else {
        console.log('❌ Ошибка авторизации:', data.message)
        setError(data.message || 'Ошибка авторизации')
      }
    } catch (error) {
      console.error('Ошибка входа:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <M2Logo size="lg" />
          </div>
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
            Войти в аккаунт
          </h2>
          <p className="text-center text-gray-600">
            Или{' '}
            <a
              href="/register"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              зарегистрироваться
            </a>
          </p>
        </div>

        <TeamsCard className="p-8 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <TeamsInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите ваш email"
                label="Email"
              />
            </div>

            <div>
              <TeamsInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите ваш пароль"
                label="Пароль"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Запомнить меня
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                  Забыли пароль?
                </a>
              </div>
            </div>

            <div>
              <TeamsButton
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </TeamsButton>
            </div>
          </form>
        </TeamsCard>
      </div>
    </div>
  )
} 