'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeamsButton } from '@/components/ui/teams/TeamsButton'
import { TeamsInput } from '@/components/ui/teams/TeamsInput'
import { TeamsCard } from '@/components/ui/teams/TeamsCard'
import { M2Icon } from '@/components/ui/M2Logo'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
}

export function RegisterForm() {
  const router = useRouter()

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
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

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return false
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Некорректный формат email')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        // Перенаправляем на страницу входа с сообщением об успехе
        router.push('/login?message=registration_success')
      } else {
        setError(data.message || 'Ошибка регистрации')
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 py-responsive-lg sm:py-responsive-xl px-responsive-sm sm:px-responsive-md lg:px-responsive-lg">
      <div className="max-w-md w-full space-y-responsive-lg sm:space-y-responsive-xl">
        <div>
          <div className="flex justify-center mb-responsive-md sm:mb-responsive-lg">
            <M2Icon size="lg" />
          </div>
          <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-responsive-sm sm:mb-responsive-md">
            Создать аккаунт
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600">
            Или{' '}
            <a
              href="/login"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              войти в существующий
            </a>
            {' '}или{' '}
            <a
              href="/"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              вернуться на главную
            </a>
          </p>
        </div>

        <TeamsCard className="p-responsive-lg sm:p-responsive-xl shadow-xl">
          <form className="space-y-responsive-md sm:space-y-responsive-lg" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Имя
                </label>
                <TeamsInput
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Имя"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Фамилия
                </label>
                <TeamsInput
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Фамилия"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <TeamsInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите ваш email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Телефон (необязательно)
              </label>
              <TeamsInput
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <TeamsInput
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Минимум 6 символов"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Подтвердите пароль
              </label>
              <TeamsInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Повторите пароль"
              />
            </div>

            <div>
              <TeamsButton
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </TeamsButton>
            </div>
          </form>
        </TeamsCard>
      </div>
    </div>
  )
} 