'use client'

import Link from 'next/link'
import { TeamsButton } from '@/components/ui/teams'
import { Lock, ArrowRight } from 'lucide-react'

interface AuthRequiredProps {
  title?: string
  message?: string
  showRegisterLink?: boolean
}

export function AuthRequired({ 
  title = 'Требуется авторизация', 
  message = 'Для доступа к этой странице необходимо войти в систему',
  showRegisterLink = true 
}: AuthRequiredProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="w-full">
            <TeamsButton className="w-full">
              Войти в систему
              <ArrowRight className="w-4 h-4 ml-2" />
            </TeamsButton>
          </Link>
          
          {showRegisterLink && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Нет аккаунта?{' '}
                <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 