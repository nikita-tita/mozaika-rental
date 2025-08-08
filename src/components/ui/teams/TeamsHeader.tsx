'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TeamsButton, TeamsBadge } from '@/components/ui/teams'
import { Building2, Bell, User, Menu, LogOut } from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'

interface TeamsHeaderProps {
  onMobileMenuOpen?: () => void
}

export default function TeamsHeader({ onMobileMenuOpen }: TeamsHeaderProps) {
  const { isAuthenticated, user, logout } = useApp()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-[#e1dfdd] shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - название */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#0078d4] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">M²</span>
            </div>
            <span className="hidden sm:block text-lg sm:text-xl font-bold text-[#323130]">Метр квадратный</span>
          </div>

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
              className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={onMobileMenuOpen}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 