'use client'

import { useState } from 'react'
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
  ChevronDown,
  ChevronRight
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

export function TeamsSidebar() {
  const pathname = usePathname()
  const { user, logout } = useApp()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className={`bg-white shadow-lg flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
                    : 'text-[#605e5c] hover:bg-[#f3f2f1] hover:text-[#323130]'
                }`}
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
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#605e5c] rounded-md hover:bg-[#f3f2f1] hover:text-[#323130] transition-colors"
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