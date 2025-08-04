import React from 'react'
import { cn } from '@/lib/utils'

interface TeamsTableProps {
  children: React.ReactNode
  className?: string
}

interface TeamsTableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TeamsTableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TeamsTableRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}

interface TeamsTableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export const TeamsTable: React.FC<TeamsTableProps> = ({ children, className }) => {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  )
}

export const TeamsTableHeader: React.FC<TeamsTableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  )
}

export const TeamsTableBody: React.FC<TeamsTableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={cn('bg-white divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  )
}

export const TeamsTableRow: React.FC<TeamsTableRowProps> = ({ 
  children, 
  className, 
  onClick, 
  selected = false 
}) => {
  return (
    <tr 
      className={cn(
        'hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        selected && 'bg-blue-50 border-l-4 border-blue-500',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export const TeamsTableCell: React.FC<TeamsTableCellProps> = ({ 
  children, 
  className, 
  align = 'left' 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <td className={cn(
      'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      alignClasses[align],
      className
    )}>
      {children}
    </td>
  )
}

export const TeamsTableHeaderCell: React.FC<TeamsTableCellProps> = ({ 
  children, 
  className, 
  align = 'left' 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <th className={cn(
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      alignClasses[align],
      className
    )}>
      {children}
    </th>
  )
} 