'use client'

import React, { useEffect } from 'react'
import { TeamsErrorBoundary } from '@/components/ui/teams'
import { useAppState, useAppActions } from '@/lib/state/AppState'

interface TeamsLayoutProps {
  children: React.ReactNode
}

export default function TeamsLayout({ children }: TeamsLayoutProps) {
  const { user, isAuthenticated, loading, error } = useAppState()
  const { setLoading, setError, clearError, addNotification } = useAppActions()

  // Инициализация приложения
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading({ isLoading: true, message: 'Загрузка приложения...' })

        // Проверяем аутентификацию
        const token = localStorage.getItem('token')
        if (token) {
          // Здесь можно добавить проверку токена на сервере
          const userData = localStorage.getItem('userData')
          if (userData) {
            try {
              const user = JSON.parse(userData)
              // Обновляем состояние пользователя
              // login(user) будет вызван автоматически через middleware
            } catch (e) {
              console.error('Error parsing user data:', e)
              localStorage.removeItem('userData')
              localStorage.removeItem('token')
            }
          }
        }

        // Добавляем приветственное уведомление для новых пользователей
        if (isAuthenticated && user) {
          const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
          if (!hasSeenWelcome) {
            addNotification({
              type: 'info',
              title: 'Добро пожаловать в Mozaika!',
              message: 'Мы обновили интерфейс для лучшего пользовательского опыта. Изучите новые возможности!',
              action: {
                label: 'Узнать больше',
                url: '/teams-ui-kit'
              }
            })
            localStorage.setItem('hasSeenWelcome', 'true')
          }
        }

      } catch (error) {
        console.error('App initialization error:', error)
        setError({
          hasError: true,
          message: 'Ошибка инициализации приложения',
          code: 'INIT_ERROR'
        })
      } finally {
        setLoading({ isLoading: false })
      }
    }

    initializeApp()
  }, [isAuthenticated, user])

  // Обработка глобальных ошибок
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setError({
        hasError: true,
        message: 'Произошла неожиданная ошибка',
        code: 'UNHANDLED_REJECTION'
      })
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      setError({
        hasError: true,
        message: 'Произошла ошибка в приложении',
        code: 'GLOBAL_ERROR'
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <TeamsErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </TeamsErrorBoundary>
  )
} 