'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/components/providers/AppProvider'
import { 
  Home,
  Building2,
  FileText,
  CreditCard,
  Users,
  Settings,
  FileSignature,
  TrendingUp,
  Calculator,
  ExternalLink
} from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const menuItems: MenuItem[] = [
  {
    title: 'Панель управления',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'Недвижимость',
    href: '/properties',
    icon: Building2
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
    title: 'Клиенты',
    href: '/clients',
    icon: Users
  },
  {
    title: 'Конструктор',
    href: '/contracts',
    icon: FileText
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
    icon: TrendingUp
  },
  {
    title: 'M²xЯндексАренда',
    href: '/yandex-rental',
    icon: ExternalLink
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

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-8rem)] bg-white shadow-lg z-40 w-64">
      <div className="h-full flex flex-col">
        {/* Пользователь */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Выход */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  )
} 