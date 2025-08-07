'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Building2, 
  Calendar, 
  FileText, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ChevronDown,
  User,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  TeamsButton, 
  TeamsBadge, 
  TeamsModal, 
  TeamsTabs,
  TeamsSelect 
} from './index'
import { TeamsNotificationCenter } from './TeamsNotificationCenter'
import { useApp } from '@/components/providers/AppProvider'
import { useNavigationTranslations } from '@/lib/i18n/hooks'

interface NavigationItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  children?: NavigationItem[]
  roles?: string[]
}

interface TeamsNavigationProps {
  className?: string
}

export const TeamsNavigation: React.FC<TeamsNavigationProps> = ({
  className
}) => {
  const pathname = usePathname()
  const { user, logout } = useApp()
  const t = useNavigationTranslations()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigationItems: NavigationItem[] = [
    {
      label: t('dashboard'),
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      roles: ['TENANT', 'LANDLORD', 'REALTOR', 'ADMIN']
    },
    {
      label: t('properties'),
      href: '/properties',
      icon: <Building2 className="h-5 w-5" />,
      roles: ['LANDLORD', 'REALTOR', 'ADMIN']
    },
    {
      label: t('bookings'),
      href: '/bookings',
      icon: <Calendar className="h-5 w-5" />,
      roles: ['TENANT', 'LANDLORD', 'REALTOR', 'ADMIN']
    },
    {
      label: t('contracts'),
      href: '/contracts',
      icon: <FileText className="h-5 w-5" />,
      roles: ['TENANT', 'LANDLORD', 'REALTOR', 'ADMIN']
    },
    {
      label: t('payments'),
      href: '/payments',
      icon: <CreditCard className="h-5 w-5" />,
      roles: ['TENANT', 'LANDLORD', 'REALTOR', 'ADMIN']
    },
    {
      label: t('clients'),
      href: '/clients',
      icon: <Users className="h-5 w-5" />,
      roles: ['REALTOR', 'ADMIN']
    },
    {
      label: t('settings'),
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['TENANT', 'LANDLORD', 'REALTOR', 'ADMIN']
    }
  ]

  const filteredNavigation = navigationItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  )

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard-enhanced'
    }
    return pathname.startsWith(href)
  }

  const renderNavigationItem = (item: NavigationItem) => {
    const active = isActive(item.href)
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          active
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
            : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'
        )}
        onClick={() => setShowMobileMenu(false)}
      >
        <span className="mr-3">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <TeamsBadge variant="primary" size="sm">
            {item.badge}
          </TeamsBadge>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn(
        'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-sm',
        sidebarCollapsed && 'lg:w-16',
        className
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
          <Link href="/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M²</span>
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-xl font-bold text-gray-900">Mozaika</span>
            )}
          </Link>
          
          <TeamsButton
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </TeamsButton>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 bg-white">
          <div className="px-3 space-y-1">
            {filteredNavigation.map(renderNavigationItem)}
          </div>
        </div>

        {/* User Menu */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TeamsButton
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </TeamsButton>
              
              <Link href="/dashboard" className="ml-3 flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M²</span>
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">Mozaika</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <TeamsNotificationCenter />
              
              <TeamsButton
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="h-5 w-5" />
              </TeamsButton>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="px-3 py-2 space-y-1 bg-white">
          {filteredNavigation.map(renderNavigationItem)}
        </div>
          </div>
        )}
      </div>

      {/* User Menu Modal */}
      <TeamsModal
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        title={t('profile')}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <Link href="/profile">
                <TeamsButton variant="ghost" className="w-full justify-start text-gray-900 hover:text-gray-900">
                  <User className="h-4 w-4 mr-2" />
                  {t('profile')}
                </TeamsButton>
              </Link>
              
              <Link href="/settings">
                <TeamsButton variant="ghost" className="w-full justify-start text-gray-900 hover:text-gray-900">
                  <Settings className="h-4 w-4 mr-2" />
                  {t('settings')}
                </TeamsButton>
              </Link>
              
              <TeamsButton
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </TeamsButton>
            </div>
          </div>
        </div>
      </TeamsModal>

      {/* Main Content Wrapper */}
      <div className={cn(
        'lg:pl-64',
        sidebarCollapsed && 'lg:pl-16'
      )}>
        {/* Content goes here */}
      </div>
    </>
  )
} 