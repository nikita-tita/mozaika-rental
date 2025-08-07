'use client'

import { TeamsBadge, TeamsButton } from '@/components/ui/teams'
import { Send, Clock, CheckCircle, AlertCircle, Mail, MessageSquare } from 'lucide-react'

interface ReminderStatusProps {
  payment: any
  onSendReminder?: (paymentId: string, type: 'EMAIL' | 'SMS') => void
}

export default function ReminderStatus({ payment, onSendReminder }: ReminderStatusProps) {
  const hasReminders = payment.reminderSentAt || payment.reminderCount > 0
  const isOverdue = payment.status === 'OVERDUE' && payment.dueDate && new Date(payment.dueDate) < new Date()

  const getReminderIcon = () => {
    if (payment.lastReminderType === 'SMS') {
      return <MessageSquare className="w-4 h-4" />
    }
    return <Mail className="w-4 h-4" />
  }

  const getReminderStatus = () => {
    if (!hasReminders) {
      return {
        label: 'Напоминание не отправлено',
        variant: 'default' as const,
        icon: <Clock className="w-4 h-4" />
      }
    }

    if (payment.reminderCount >= 3) {
      return {
        label: 'Максимум напоминаний',
        variant: 'error' as const,
        icon: <AlertCircle className="w-4 h-4" />
      }
    }

    return {
      label: `Напоминание отправлено (${payment.reminderCount})`,
      variant: 'warning' as const,
      icon: <CheckCircle className="w-4 h-4" />
    }
  }

  const reminderStatus = getReminderStatus()

  const handleSendEmail = () => {
    if (onSendReminder) {
      onSendReminder(payment.id, 'EMAIL')
    }
  }

  const handleSendSMS = () => {
    if (onSendReminder) {
      onSendReminder(payment.id, 'SMS')
    }
  }

  return (
    <div className="space-y-3">
      {/* Статус напоминаний */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {reminderStatus.icon}
          <TeamsBadge variant={reminderStatus.variant}>
            {reminderStatus.label}
          </TeamsBadge>
        </div>
        
        {hasReminders && (
          <div className="text-xs text-gray-500">
            {payment.reminderSentAt && (
              <div>
                Последнее: {new Date(payment.reminderSentAt).toLocaleDateString('ru-RU')}
              </div>
            )}
            {payment.lastReminderType && (
              <div className="flex items-center">
                {getReminderIcon()}
                <span className="ml-1">
                  {payment.lastReminderType === 'SMS' ? 'SMS' : 'Email'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Кнопки отправки */}
      {payment.status === 'PENDING' && payment.reminderCount < 3 && (
        <div className="flex gap-2">
          <TeamsButton
            onClick={handleSendEmail}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TeamsButton>
          <TeamsButton
            onClick={handleSendSMS}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS
          </TeamsButton>
        </div>
      )}

      {/* Предупреждение о просрочке */}
      {isOverdue && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm text-red-700">
              Платеж просрочен на {(Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)))} дней
            </span>
          </div>
        </div>
      )}

      {/* Информация о следующем напоминании */}
      {hasReminders && payment.reminderCount < 3 && (
        <div className="text-xs text-gray-500">
          Следующее напоминание можно отправить через{' '}
          {payment.reminderSentAt ? 
            Math.max(0, 24 - Math.floor((new Date().getTime() - new Date(payment.reminderSentAt).getTime()) / (1000 * 60 * 60))) + ' ч' :
            'сейчас'
          }
        </div>
      )}
    </div>
  )
} 