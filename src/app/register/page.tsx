'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Building2, ArrowLeft, CheckCircle } from 'lucide-react'

const userRoleOptions = [
  { value: 'REALTOR', label: 'Риелтор' }
]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'REALTOR',
    agreeToTerms: false,
    agreeToPrivacy: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Валидация на фронтенде
    const newErrors: Record<string, string> = {}

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласиться с условиями использования'
    }

    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'Необходимо согласиться с политикой конфиденциальности'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push('/login?message=registration-success')
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({ general: 'Произошла ошибка при регистрации' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Убираем ошибку для поля при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
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
            Создать аккаунт
          </h2>
          <p className="text-primary-600">
            Или{' '}
            <Link
              href="/login"
              className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              войдите в существующий аккаунт
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Имя"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                className="text-gray-900"
              />

              <Input
                label="Фамилия"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                className="text-gray-900"
              />
            </div>

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
              label="Телефон"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+7 (999) 123-45-67"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="Необязательно"
              className="text-gray-900"
            />

            <Select
              label="Тип аккаунта"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={userRoleOptions}
              error={errors.role}
            />

            <Input
              label="Пароль"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Минимум 6 символов"
              className="text-gray-900"
            />

            <Input
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              className="text-gray-900"
            />

            {/* Согласия */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleCheckboxChange}
                  className="mt-1 w-4 h-4 text-brand-600 bg-white border-primary-300 rounded focus:ring-brand-500 focus:ring-2"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-primary-700">
                  Я соглашаюсь с{' '}
                  <Link href="/terms" className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
                    условиями использования
                  </Link>
                  {errors.agreeToTerms && (
                    <span className="block text-red-600 text-xs mt-1">{errors.agreeToTerms}</span>
                  )}
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeToPrivacy"
                  name="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onChange={handleCheckboxChange}
                  className="mt-1 w-4 h-4 text-brand-600 bg-white border-primary-300 rounded focus:ring-brand-500 focus:ring-2"
                />
                <label htmlFor="agreeToPrivacy" className="text-sm text-primary-700">
                  Я соглашаюсь с{' '}
                  <Link href="/privacy" className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
                    политикой конфиденциальности
                  </Link>
                  {errors.agreeToPrivacy && (
                    <span className="block text-red-600 text-xs mt-1">{errors.agreeToPrivacy}</span>
                  )}
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              Создать аккаунт
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