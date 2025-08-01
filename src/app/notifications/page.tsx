'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  FileText, 
  Home,
  MessageSquare,
  Settings as SettingsIcon,
  Check,
  CheckCheck
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: any
  read: boolean
  readAt?: string
  priority: string
  channels: string[]
  propertyId?: string
  bookingId?: string
  contractId?: string
  paymentId?: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [unreadOnly, page])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '20')
      if (unreadOnly) {
        params.append('unreadOnly', 'true')
      }

      const response = await fetch(`/api/notifications?${params}`)
      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setNotifications(data.data)
        } else {
          setNotifications(prev => [...prev, ...data.data])
        }
        setHasMore(data.meta.hasMore)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId
              ? { ...n, read: true, readAt: new Date().toISOString() }
              : n
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markAll: true })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_created':
      case 'booking_confirmed':
      case 'booking_cancelled':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'payment_required':
      case 'payment_completed':
      case 'payment_failed':
        return <CreditCard className="h-5 w-5 text-green-500" />
      case 'contract_signed':
        return <FileText className="h-5 w-5 text-purple-500" />
      case 'property_approved':
      case 'property_rejected':
        return <Home className="h-5 w-5 text-orange-500" />
      case 'review_received':
        return <MessageSquare className="h-5 w-5 text-pink-500" />
      case 'message_received':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500'
      case 'high':
        return 'border-l-orange-500'
      case 'normal':
        return 'border-l-blue-500'
      case 'low':
        return 'border-l-gray-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getRelatedLink = (notification: Notification) => {
    if (notification.bookingId) {
      return `/bookings`
    }
    if (notification.contractId) {
      return `/contracts/${notification.contractId}`
    }
    if (notification.paymentId) {
      return `/payments`
    }
    if (notification.propertyId) {
      return `/properties/${notification.propertyId}`
    }
    return null
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600 mr-8">
                M²
              </Link>
              <nav className="hidden md:flex md:space-x-8">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  Панель управления
                </Link>
                <Link href="/notifications" className="text-primary-600 font-medium">
                  Уведомления
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unread-only"
                checked={unreadOnly}
                onChange={(e) => {
                  setUnreadOnly(e.target.checked)
                  setPage(1)
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="unread-only" className="text-sm text-gray-700">
                Только непрочитанные
              </label>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Отметить все как прочитанные
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading && page === 1 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {unreadOnly ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {unreadOnly 
                ? 'Все уведомления прочитаны' 
                : 'Уведомления будут появляться здесь'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                getIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                getRelatedLink={getRelatedLink}
              />
            ))}

            {hasMore && (
              <div className="text-center pt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(prev => prev + 1)}
                  loading={loading}
                >
                  Загрузить еще
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  getIcon: (type: string) => React.ReactNode
  getPriorityColor: (priority: string) => string
  getRelatedLink: (notification: Notification) => string | null
}

function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  getIcon, 
  getPriorityColor, 
  getRelatedLink 
}: NotificationCardProps) {
  const relatedLink = getRelatedLink(notification)

  return (
    <div className={`bg-white rounded-lg shadow border-l-4 ${getPriorityColor(notification.priority)} ${
      !notification.read ? 'bg-blue-50' : ''
    }`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-medium ${
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h3>
              
              <div className="flex items-center space-x-2">
                {notification.priority === 'urgent' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Срочно
                  </span>
                )}
                
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <p className={`text-sm mb-3 ${
              !notification.read ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {notification.message}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatDate(new Date(notification.createdAt))}</span>
                
                {notification.channels.length > 0 && (
                  <span>
                    Отправлено: {notification.channels.join(', ')}
                  </span>
                )}
              </div>

              {relatedLink && (
                <Link href={relatedLink}>
                  <Button size="sm" variant="outline">
                    Перейти
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}