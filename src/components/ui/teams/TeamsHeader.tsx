'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { Building2, Bell, User, Menu, LogOut } from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'
import { MobileMenu } from './MobileMenu'

export default function TeamsHeader() {
  const { isAuthenticated, user, logout } = useApp()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">


          {/* Navigation - убрано согласно требованиям */}

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link href="/dashboard" className="text-right hidden sm:block hover:opacity-80 transition-opacity">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.role === 'REALTOR' ? 'Риелтор' : user?.role}
                  </div>
                </Link>
                <Link href="/dashboard" className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                </Link>
                <TeamsButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hidden lg:flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </TeamsButton>
                {/* Мобильная кнопка выхода */}
                <TeamsButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="lg:hidden p-1.5"
                >
                  <LogOut className="w-4 h-4" />
                </TeamsButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link href="/login">
                  <TeamsButton variant="ghost" size="sm" className="text-xs sm:text-sm">
                    Войти
                  </TeamsButton>
                </Link>
                <Link href="/register">
                  <TeamsButton size="sm" className="text-xs sm:text-sm">
                    Регистрация
                  </TeamsButton>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </header>
  )
} 