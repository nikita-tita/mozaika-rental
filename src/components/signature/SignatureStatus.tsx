'use client'

import { TeamsBadge } from '@/components/ui/teams'
import { CheckCircle, Clock, AlertCircle, Send, UserCheck } from 'lucide-react'

interface SignatureStatusProps {
  status: 'pending' | 'signed' | 'expired' | 'cancelled'
  signers: Array<{
    id: string
    role: string
    status: 'pending' | 'sent' | 'signed' | 'declined' | 'expired'
    signedAt?: string
    client?: {
      firstName: string
      lastName: string
    }
  }>
}

export default function SignatureStatus({ status, signers }: SignatureStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'success'
      case 'pending': return 'warning'
      case 'expired': return 'error'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'expired': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed': return 'Подписан'
      case 'pending': return 'Ожидает подписи'
      case 'expired': return 'Истек срок'
      case 'cancelled': return 'Отменен'
      default: return 'Неизвестно'
    }
  }

  const getSignerStatusText = (status: string) => {
    switch (status) {
      case 'signed': return 'Подписал'
      case 'pending': return 'Ожидает'
      case 'sent': return 'Отправлено'
      case 'declined': return 'Отклонил'
      case 'expired': return 'Истекло'
      default: return 'Неизвестно'
    }
  }

  const getSignerRoleText = (role: string) => {
    switch (role) {
      case 'landlord': return 'Арендодатель'
      case 'tenant': return 'Арендатор'
      case 'realtor': return 'Риелтор'
      case 'witness': return 'Свидетель'
      default: return 'Подписант'
    }
  }

  const signedCount = signers.filter(s => s.status === 'signed').length
  const totalCount = signers.length

  return (
    <div className="space-y-4">
      {/* Общий статус документа */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <span className="font-medium">Статус документа</span>
        </div>
        <TeamsBadge variant={getStatusColor(status)}>
          {getStatusText(status)}
        </TeamsBadge>
      </div>

      {/* Прогресс подписи */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Прогресс подписи</span>
          <span className="font-medium">{signedCount} из {totalCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (signedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Список подписантов */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700">Подписанты:</h4>
        {signers.map((signer) => (
          <div key={signer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                {signer.status === 'signed' ? (
                  <UserCheck className="w-4 h-4 text-green-600" />
                ) : signer.status === 'sent' ? (
                  <Send className="w-4 h-4 text-blue-600" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm">
                  {signer.client ? `${signer.client.firstName} ${signer.client.lastName}` : 'Неизвестно'}
                </div>
                <div className="text-xs text-gray-500">
                  {getSignerRoleText(signer.role)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <TeamsBadge 
                variant={signer.status === 'signed' ? 'success' : 'warning'}
                size="sm"
              >
                {getSignerStatusText(signer.status)}
              </TeamsBadge>
              {signer.signedAt && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(signer.signedAt).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Информация о статусе */}
      {status === 'pending' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Ожидание подписи</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Документ отправлен на подпись. Уведомления отправлены всем подписантам.
          </p>
        </div>
      )}

      {status === 'signed' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Документ подписан</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Все подписанты подписали документ. Документ имеет юридическую силу.
          </p>
        </div>
      )}

      {status === 'expired' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Срок истек</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            Срок подписи документа истек. Необходимо создать новый документ для подписи.
          </p>
        </div>
      )}
    </div>
  )
} 