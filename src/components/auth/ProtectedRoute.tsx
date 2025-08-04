'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/providers/AppProvider'
import { AuthRequired } from './AuthRequired'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  title?: string
  message?: string
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  title,
  message 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🛡️ Попытка доступа к защищенной странице без авторизации')
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  // Если пользователь не авторизован, показываем fallback или AuthRequired
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <AuthRequired title={title} message={message} />
  }

  // Если пользователь авторизован, показываем содержимое
  return <>{children}</>
} 