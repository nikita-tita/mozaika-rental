'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Settings, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeamsButton, TeamsBadge, TeamsModal, TeamsTabs } from './index'
import { useNotifications, useUnreadCount, useAppActions } from '@/lib/state/AppState'

interface TeamsNotificationCenterProps {
  className?: string
}

export const TeamsNotificationCenter: React.FC<TeamsNotificationCenterProps> = ({
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const notifications = useNotifications()
  const unreadCount = useUnreadCount()
  const { markNotificationAsRead, markAllAsRead, clearNotifications } = useAppActions()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    setIsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Только что'
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} ч назад`
    if (days < 7) return `${days} дн назад`
    return new Date(timestamp).toLocaleDateString('ru-RU')
  }

  const tabs = [
    {
      id: 'all',
      label: 'Все',
      content: (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Нет уведомлений</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-colors',
                  notification.read
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-blue-200 shadow-sm'
                )}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.action && (
                      <TeamsButton
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = notification.action!.url
                        }}
                      >
                        {notification.action.label}
                      </TeamsButton>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )
    },
    {
      id: 'unread',
      label: 'Непрочитанные',
      content: (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.filter(n => !n.read).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Все уведомления прочитаны</p>
            </div>
          ) : (
            notifications
              .filter(n => !n.read)
              .map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-lg border border-blue-200 bg-white shadow-sm cursor-pointer transition-colors"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.action && (
                        <TeamsButton
                          size="sm"
                          variant="ghost"
                          className="mt-2 h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = notification.action!.url
                          }}
                        >
                          {notification.action.label}
                        </TeamsButton>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )
    }
  ]

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Кнопка уведомлений */}
      <TeamsButton
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <TeamsBadge
            variant="error"
            size="sm"
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </TeamsBadge>
        )}
      </TeamsButton>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
            <div className="flex items-center gap-2">
              <TeamsButton
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </TeamsButton>
              <TeamsButton
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </TeamsButton>
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <TeamsButton
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-3 w-3 mr-1" />
              Отметить все как прочитанные
            </TeamsButton>
            <TeamsButton
              size="sm"
              variant="outline"
              onClick={clearNotifications}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Очистить
            </TeamsButton>
          </div>

          {/* Список уведомлений */}
          <div className="p-3">
            <TeamsTabs
              tabs={tabs}
              defaultTab="all"
              variant="pills"
            />
          </div>
        </div>
      )}

      {/* Модальное окно настроек */}
      <TeamsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Настройки уведомлений"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Каналы уведомлений</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Email уведомления</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Push уведомления</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">SMS уведомления</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Уведомления в приложении</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Типы уведомлений</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Новые бронирования</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Обновления договоров</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Платежи</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Системные уведомления</span>
              </label>
            </div>
          </div>
        </div>
      </TeamsModal>
    </div>
  )
} 