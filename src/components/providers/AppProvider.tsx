'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  verified: boolean
}

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (user: User) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
          console.log('✅ Пользователь авторизован:', data.user.email)
        } else {
          setUser(null)
          console.log('❌ Пользователь не авторизован')
        }
      } else {
        setUser(null)
        console.log('❌ Ошибка проверки авторизации:', response.status)
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    setLoading(false)
    console.log('✅ Пользователь авторизован:', userData.email)
  }

  const logout = async () => {
    try {
      console.log('🚪 Выполняется выход из системы...')
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Ошибка выхода:', error)
    } finally {
      setUser(null)
      console.log('✅ Выход выполнен, перенаправление на /login')
      // Принудительное перенаправление на страницу входа
      window.location.href = '/login'
    }
  }

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    checkAuth()
  }, [])

  // Проверяем авторизацию при изменении маршрута
  useEffect(() => {
    if (!loading) {
      // Если пользователь авторизован и находится на страницах авторизации
      if (user && (pathname === '/login' || pathname === '/register')) {
        console.log('🔄 Авторизованный пользователь на странице входа, перенаправляем на home')
        window.location.href = '/home'
      }
      // Если пользователь авторизован и находится на главной странице
      else if (user && pathname === '/') {
        console.log('🔄 Авторизованный пользователь на главной странице, перенаправляем на home')
        window.location.href = '/home'
      }
      // Если пользователь не авторизован и находится на защищенной странице
      else if (!user && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
        console.log('🛡️ Попытка доступа к защищенной странице без авторизации')
        router.push('/login')
      }
    }
  }, [user, loading, pathname, router])

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    checkAuth
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 