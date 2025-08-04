import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// Типы для состояния приложения
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'TENANT' | 'LANDLORD' | 'REALTOR' | 'ADMIN'
  phone?: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'ru' | 'en'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }
  ui: {
    sidebarCollapsed: boolean
    compactMode: boolean
    showTutorials: boolean
  }
}

export interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
}

export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
  retryAction?: () => void
}

// Основное состояние приложения
interface AppState {
  // Пользователь
  user: User | null
  isAuthenticated: boolean
  
  // Настройки
  settings: AppSettings
  
  // Уведомления
  notifications: NotificationItem[]
  unreadCount: number
  
  // Состояния загрузки и ошибок
  loading: LoadingState
  error: ErrorState
  
  // Кэш данных
  cache: {
    properties: Map<string, any>
    bookings: Map<string, any>
    contracts: Map<string, any>
    payments: Map<string, any>
  }
  
  // Действия пользователя (экспортируем напрямую)
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  
  // Настройки
  updateSettings: (updates: Partial<AppSettings>) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  
  // Уведомления
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  markAllAsRead: () => void
  
  // Загрузка и ошибки
  setLoading: (loading: LoadingState) => void
  setError: (error: ErrorState) => void
  clearError: () => void
  
  // Кэш
  cacheProperty: (id: string, data: any) => void
  cacheBooking: (id: string, data: any) => void
  cacheContract: (id: string, data: any) => void
  cachePayment: (id: string, data: any) => void
  clearCache: () => void
}

// Начальные настройки
const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'ru',
  notifications: {
    email: true,
    push: true,
    sms: false,
    inApp: true
  },
  ui: {
    sidebarCollapsed: false,
    compactMode: false,
    showTutorials: true
  }
}

// Создание store без персистентности для тестирования
export const useAppState = create<AppState>((set, get) => ({
  // Начальное состояние
  user: null,
  isAuthenticated: false,
  settings: defaultSettings,
  notifications: [],
  unreadCount: 0,
  loading: { isLoading: false },
  error: { hasError: false },
  cache: {
    properties: new Map(),
    bookings: new Map(),
    contracts: new Map(),
    payments: new Map()
  },

  // Действия (экспортируем напрямую)
  login: (user: User) => {
    console.log('🔧 Zustand login вызван с пользователем:', user)
    set({
      user,
      isAuthenticated: true,
      error: { hasError: false }
    })
    console.log('✅ Zustand состояние обновлено после login')
  },

  logout: () => {
    console.log('🔧 Zustand logout вызван')
    set({
      user: null,
      isAuthenticated: false,
      notifications: [],
      unreadCount: 0,
      cache: {
        properties: new Map(),
        bookings: new Map(),
        contracts: new Map(),
        payments: new Map()
      }
    })
    console.log('✅ Zustand состояние обновлено после logout')
  },

  updateUser: (updates: Partial<User>) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),

  // Настройки
  updateSettings: (updates: Partial<AppSettings>) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),

  toggleTheme: () => set((state) => {
    const currentTheme = state.settings.theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    return {
      settings: { ...state.settings, theme: newTheme }
    }
  }),

  toggleSidebar: () => set((state) => ({
    settings: {
      ...state.settings,
      ui: {
        ...state.settings.ui,
        sidebarCollapsed: !state.settings.ui.sidebarCollapsed
      }
    }
  })),

  // Уведомления
  addNotification: (notification) => set((state) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    const newNotifications = [newNotification, ...state.notifications].slice(0, 50) // Ограничиваем 50 уведомлениями
    const newUnreadCount = newNotifications.filter(n => !n.read).length

    return {
      notifications: newNotifications,
      unreadCount: newUnreadCount
    }
  }),

  markNotificationAsRead: (id: string) => set((state) => {
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    )
    const newUnreadCount = updatedNotifications.filter(n => !n.read).length

    return {
      notifications: updatedNotifications,
      unreadCount: newUnreadCount
    }
  }),

  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),

  // Загрузка и ошибки
  setLoading: (loading: LoadingState) => set({ loading }),

  setError: (error: ErrorState) => set({ error }),

  clearError: () => set({ error: { hasError: false } }),

  // Кэш
  cacheProperty: (id: string, data: any) => set((state) => {
    const newCache = new Map(state.cache.properties)
    newCache.set(id, { ...data, cachedAt: new Date() })
    return {
      cache: { ...state.cache, properties: newCache }
    }
  }),

  cacheBooking: (id: string, data: any) => set((state) => {
    const newCache = new Map(state.cache.bookings)
    newCache.set(id, { ...data, cachedAt: new Date() })
    return {
      cache: { ...state.cache, bookings: newCache }
    }
  }),

  cacheContract: (id: string, data: any) => set((state) => {
    const newCache = new Map(state.cache.contracts)
    newCache.set(id, { ...data, cachedAt: new Date() })
    return {
      cache: { ...state.cache, contracts: newCache }
    }
  }),

  cachePayment: (id: string, data: any) => set((state) => {
    const newCache = new Map(state.cache.payments)
    newCache.set(id, { ...data, cachedAt: new Date() })
    return {
      cache: { ...state.cache, payments: newCache }
    }
  }),

  clearCache: () => set((state) => ({
    cache: {
      properties: new Map(),
      bookings: new Map(),
      contracts: new Map(),
      payments: new Map()
    }
  }))
}))

// Хуки для удобного использования
export const useUser = () => useAppState((state) => state.user)
export const useIsAuthenticated = () => useAppState((state) => state.isAuthenticated)
export const useSettings = () => useAppState((state) => state.settings)
export const useNotifications = () => useAppState((state) => state.notifications)
export const useUnreadCount = () => useAppState((state) => state.unreadCount)
export const useLoading = () => useAppState((state) => state.loading)
export const useError = () => useAppState((state) => state.error)
export const useAppActions = () => useAppState((state) => ({
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
  updateSettings: state.updateSettings,
  toggleTheme: state.toggleTheme,
  toggleSidebar: state.toggleSidebar,
  addNotification: state.addNotification,
  markNotificationAsRead: state.markNotificationAsRead,
  clearNotifications: state.clearNotifications,
  markAllAsRead: state.markAllAsRead,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  cacheProperty: state.cacheProperty,
  cacheBooking: state.cacheBooking,
  cacheContract: state.cacheContract,
  cachePayment: state.cachePayment,
  clearCache: state.clearCache
})) 