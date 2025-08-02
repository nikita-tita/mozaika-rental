'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Building2, ArrowLeft, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Сохраняем токен в localStorage
        if (data.token) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('userData', JSON.stringify(data.data))
        }
        router.push('/dashboard')
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({ general: 'Произошла ошибка при входе' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Убираем ошибку для поля при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-900 mb-2">
            Войти в аккаунт
          </h2>
          <p className="text-primary-600">
            Или{' '}
            <Link
              href="/register"
              className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              создайте новый аккаунт
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-hover">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="text-sm text-red-700">{errors.general}</div>
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="text-gray-900"
            />

            <Input
              label="Пароль"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className="text-gray-900"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-primary-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-primary-700">
                  Запомнить меня
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Забыли пароль?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              <Lock className="w-4 h-4 mr-2" />
              Войти
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}