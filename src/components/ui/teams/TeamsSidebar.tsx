'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/components/providers/AppProvider'
import {
  Home,
  Users,
  Building2,
  FileText,
  CreditCard,
  TrendingUp,
  Calculator,
  FileSignature,
  ExternalLink,
  Shield,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'

const menuItems = [
  {
    title: 'Панель управления',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'Объекты',
    href: '/properties',
    icon: Building2
  },
  {
    title: 'Клиенты',
    href: '/clients',
    icon: Users
  },
  {
    title: 'Сделки',
    href: '/deals',
    icon: TrendingUp
  },
  {
    title: 'Договоры',
    href: '/contracts',
    icon: FileText
  },
  {
    title: 'Платежи',
    href: '/payments',
    icon: CreditCard
  },
  {
    title: 'Скоринг',
    href: '/scoring',
    icon: Calculator
  },
  {
    title: 'Электронная подпись',
    href: '/signature',
    icon: FileSignature
  },
  {
    title: 'Мультилистинг',
    href: '/multilisting',
    icon: ExternalLink
  },
  {
    title: 'Страхование',
    href: '/insurance',
    icon: Shield
  },
  {
    title: 'M² x Яндекс.Аренда',
    href: '/yandex-rental',
    icon: ExternalLink
  },
  {
    title: 'Уведомления',
    href: '/notifications',
    icon: Bell
  },
  {
    title: 'Настройки',
    href: '/settings',
    icon: Settings
  }
]

interface TeamsSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function TeamsSidebar({ isMobileOpen = false, onMobileClose }: TeamsSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useApp()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = async () => {
    await logout()
    if (onMobileClose) onMobileClose()
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Мобильная версия
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 lg:hidden
        `}>
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#0078d4] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">M²</span>
                </div>
                <span className="text-lg font-bold text-[#323130]">Метр квадратный</span>
              </div>
              <button
                onClick={onMobileClose}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 py-2 mb-2">
                <h3 className="text-sm font-semibold text-[#605e5c] uppercase tracking-wide">Меню</h3>
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isBeta = item.href === '/yandex-rental'

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#deecf9] text-[#0078d4]'
                        : 'text-[#323130] hover:bg-[#f3f2f1] hover:text-[#323130]'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div className="flex items-center justify-between w-full">
                      <span>{item.title}</span>
                      {isBeta && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Бета
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile User Section */}
            {user && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-[#0078d4] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#323130] truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#605e5c] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#323130] rounded-md hover:bg-[#f3f2f1] hover:text-[#323130] transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // Desktop версия
  return (
    <div className={`bg-white shadow-lg flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} hidden lg:block`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-end">
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md hover:bg-gray-100"
              title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 py-2 mb-2">
              <h3 className="text-sm font-semibold text-[#605e5c] uppercase tracking-wide">Меню</h3>
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isBeta = item.href === '/yandex-rental'

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#deecf9] text-[#0078d4]'
                    : 'text-[#323130] hover:bg-[#f3f2f1] hover:text-[#323130]'
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="w-5 h-5 mr-3" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.title}</span>
                    {isBeta && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Бета
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        {!isCollapsed && user && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-[#0078d4] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#323130] truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-[#605e5c] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#323130] rounded-md hover:bg-[#f3f2f1] hover:text-[#323130] transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Выйти
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 