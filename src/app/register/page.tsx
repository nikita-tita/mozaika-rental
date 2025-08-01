'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const userRoleOptions = [
  { value: 'TENANT', label: 'Арендатор' },
  { value: 'LANDLORD', label: 'Арендодатель' }
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
    role: 'TENANT'
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">M²</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Или{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              войдите в существующий аккаунт
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
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
            />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              Создать аккаунт
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Создавая аккаунт, вы соглашаетесь с{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                условиями использования
              </Link>{' '}
              и{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                политикой конфиденциальности
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}