'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface TeamsTab {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TeamsTabsProps {
  tabs: TeamsTab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills'
}

export const TeamsTabs: React.FC<TeamsTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className,
  variant = 'default'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  const tabButtonClasses = (isActive: boolean, isDisabled: boolean) => cn(
    'px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    isDisabled && 'opacity-50 cursor-not-allowed',
    !isDisabled && 'cursor-pointer'
  )

  const defaultTabClasses = (isActive: boolean, isDisabled: boolean) => cn(
    tabButtonClasses(isActive, isDisabled),
    isActive 
      ? 'border-b-2 border-blue-500 text-blue-600' 
      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
  )

  const pillsTabClasses = (isActive: boolean, isDisabled: boolean) => cn(
    tabButtonClasses(isActive, isDisabled),
    'rounded-md',
    isActive 
      ? 'bg-blue-100 text-blue-700' 
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
  )

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={cn(
        'border-b border-gray-200',
        variant === 'pills' && 'border-b-0'
      )}>
        <nav className={cn(
          'flex space-x-8',
          variant === 'pills' && 'space-x-2'
        )}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              className={variant === 'pills' 
                ? pillsTabClasses(activeTab === tab.id, tab.disabled)
                : defaultTabClasses(activeTab === tab.id, tab.disabled)
              }
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTabContent}
      </div>
    </div>
  )
} 