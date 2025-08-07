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
    <header className="bg-white border-b border-[#e1dfdd] shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - пустое место для баланса */}
          <div className="flex-1"></div>

          {/* Right side */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-2 sm:p-2.5 text-[#323130] hover:text-[#323130] transition-colors rounded-md hover:bg-[#f3f2f1]">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link href="/dashboard" className="text-right hidden sm:block hover:opacity-80 transition-opacity px-2 py-1 rounded-md hover:bg-[#f3f2f1]">
                  <div className="text-sm font-medium text-[#323130]">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-[#605e5c]">
                    {user?.role === 'REALTOR' ? 'Риелтор' : user?.role}
                  </div>
                </Link>
                <Link href="/dashboard" className="w-8 h-8 sm:w-9 sm:h-9 bg-[#deecf9] rounded-full flex items-center justify-center hover:bg-[#c7e0f4] transition-colors">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#0078d4]" />
                </Link>
                <TeamsButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hidden lg:flex text-[#323130] hover:text-[#323130] hover:bg-[#f3f2f1]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </TeamsButton>
                {/* Мобильная кнопка выхода */}
                <TeamsButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="lg:hidden p-2 text-[#323130] hover:text-[#323130] hover:bg-[#f3f2f1]"
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