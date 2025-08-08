'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Building2, 
  Users, 
  FileText, 
  CreditCard,
  Calendar,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  CreditCard as PaymentIcon
} from 'lucide-react'
import { 
  TeamsCard, 
  TeamsButton, 
  TeamsBadge, 
  TeamsTable,
  TeamsModal,
  TeamsAlert
} from '@/components/ui/teams'

interface InsurancePoliciesListProps {
  onEdit?: (policy: any) => void
  onDelete?: (policyId: string) => void
  onPay?: (policy: any) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'DRAFT':
      return 'warning'
    case 'PENDING_PAYMENT':
      return 'warning'
    case 'EXPIRED':
      return 'error'
    case 'CANCELLED':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Активен'
    case 'DRAFT':
      return 'Черновик'
    case 'PENDING_PAYMENT':
      return 'Ожидает оплаты'
    case 'EXPIRED':
      return 'Истек'
    case 'CANCELLED':
      return 'Отменен'
    default:
      return status
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'PROPERTY':
      return Building2
    case 'LIABILITY':
      return Users
    case 'RENTAL_INCOME':
      return CreditCard
    case 'LEGAL_PROTECTION':
      return FileText
    case 'COMPREHENSIVE':
      return Shield
    default:
      return Shield
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'PROPERTY':
      return 'Имущество'
    case 'LIABILITY':
      return 'Ответственность'
    case 'RENTAL_INCOME':
      return 'Арендные платежи'
    case 'LEGAL_PROTECTION':
      return 'Юридическая защита'
    case 'COMPREHENSIVE':
      return 'Комплексное'
    default:
      return type
  }
}

export default function InsurancePoliciesList({ 
  onEdit, 
  onDelete, 
  onPay 
}: InsurancePoliciesListProps) {
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/insurance/policies')
      if (!response.ok) {
        throw new Error('Ошибка загрузки полисов')
      }
      const data = await response.json()
      setPolicies(data)
    } catch (error) {
      setError('Ошибка при загрузке страховых полисов')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (policyId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот полис?')) {
      return
    }

    try {
      const response = await fetch(`/api/insurance/policies/${policyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Ошибка удаления')
      }

      setPolicies(prev => prev.filter(p => p.id !== policyId))
      onDelete?.(policyId)
    } catch (error) {
      setError('Ошибка при удалении полиса')
    }
  }

  const handlePay = async (policy: any) => {
    try {
      const response = await fetch(`/api/insurance/policies/${policy.id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: 'CARD',
          transactionId: `TXN-${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error('Ошибка оплаты')
      }

      // Обновляем список полисов
      await fetchPolicies()
      onPay?.(policy)
    } catch (error) {
      setError('Ошибка при оплате полиса')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount)
  }

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <TeamsAlert variant="error" className="mb-6">
        <AlertTriangle className="w-4 h-4" />
        {error}
      </TeamsAlert>
    )
  }

  if (policies.length === 0) {
    return (
      <TeamsCard className="p-8 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Нет страховых полисов
        </h3>
        <p className="text-gray-600 mb-4">
          У вас пока нет оформленных страховых полисов
        </p>
        <TeamsButton onClick={() => window.location.href = '/insurance/new'}>
          Создать первый полис
        </TeamsButton>
      </TeamsCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TeamsCard className="p-4">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {policies.length}
              </div>
              <div className="text-sm text-gray-600">Всего полисов</div>
            </div>
          </div>
        </TeamsCard>

        <TeamsCard className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {policies.filter(p => p.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-600">Активных</div>
            </div>
          </div>
        </TeamsCard>

        <TeamsCard className="p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {policies.filter(p => isExpiringSoon(p.endDate)).length}
              </div>
              <div className="text-sm text-gray-600">Истекают скоро</div>
            </div>
          </div>
        </TeamsCard>

        <TeamsCard className="p-4">
          <div className="flex items-center">
            <Banknote className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(policies.reduce((sum, p) => sum + p.premium, 0))}
              </div>
              <div className="text-sm text-gray-600">Общая премия</div>
            </div>
          </div>
        </TeamsCard>
      </div>

      {/* Список полисов */}
      <div className="space-y-4">
        {policies.map((policy) => {
          const TypeIcon = getTypeIcon(policy.type)
          const isExpiring = isExpiringSoon(policy.endDate)
          const expired = isExpired(policy.endDate)

          return (
            <TeamsCard key={policy.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {policy.policyNumber}
                      </h3>
                      <TeamsBadge variant={getStatusColor(policy.status)}>
                        {getStatusLabel(policy.status)}
                      </TeamsBadge>
                      {isExpiring && !expired && (
                        <TeamsBadge variant="warning">
                          Истекает скоро
                        </TeamsBadge>
                      )}
                      {expired && (
                        <TeamsBadge variant="error">
                          Истек
                        </TeamsBadge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      {getTypeLabel(policy.type)} • {policy.insuranceCompany}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Страховая сумма:</span>
                        <div className="font-medium">{formatCurrency(policy.insuredAmount)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Премия:</span>
                        <div className="font-medium">{formatCurrency(policy.premium)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Действует до:</span>
                        <div className="font-medium">{formatDate(policy.endDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Франшиза:</span>
                        <div className="font-medium">{formatCurrency(policy.deductible)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TeamsButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPolicy(policy)
                      setShowDetails(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </TeamsButton>
                  
                  {policy.status === 'DRAFT' && (
                    <>
                      <TeamsButton
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit?.(policy)}
                      >
                        <Edit className="w-4 h-4" />
                      </TeamsButton>
                      
                      <TeamsButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(policy.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </TeamsButton>
                    </>
                  )}
                  
                  {policy.status === 'PENDING_PAYMENT' && (
                    <TeamsButton
                      size="sm"
                      onClick={() => handlePay(policy)}
                    >
                      <PaymentIcon className="w-4 h-4 mr-1" />
                      Оплатить
                    </TeamsButton>
                  )}
                  
                  {policy.status === 'ACTIVE' && (
                    <TeamsButton
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Скачать
                    </TeamsButton>
                  )}
                </div>
              </div>
            </TeamsCard>
          )
        })}
      </div>

      {/* Модальное окно с деталями */}
      <TeamsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Детали страхового полиса"
      >
        {selectedPolicy && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Номер полиса</label>
                <div className="text-sm">{selectedPolicy.policyNumber}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Тип страхования</label>
                <div className="text-sm">{getTypeLabel(selectedPolicy.type)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Страховая компания</label>
                <div className="text-sm">{selectedPolicy.insuranceCompany}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Статус</label>
                <div className="text-sm">
                  <TeamsBadge variant={getStatusColor(selectedPolicy.status)}>
                    {getStatusLabel(selectedPolicy.status)}
                  </TeamsBadge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Страховая сумма</label>
                <div className="text-sm">{formatCurrency(selectedPolicy.insuredAmount)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Премия</label>
                <div className="text-sm">{formatCurrency(selectedPolicy.premium)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Франшиза</label>
                <div className="text-sm">{formatCurrency(selectedPolicy.deductible)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Дата начала</label>
                <div className="text-sm">{formatDate(selectedPolicy.startDate)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Дата окончания</label>
                <div className="text-sm">{formatDate(selectedPolicy.endDate)}</div>
              </div>
            </div>
            
            {selectedPolicy.property && (
              <div>
                <label className="text-sm font-medium text-gray-500">Объект недвижимости</label>
                <div className="text-sm">{selectedPolicy.property.title}</div>
              </div>
            )}
            
            {selectedPolicy.payments && selectedPolicy.payments.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">История платежей</label>
                <div className="space-y-2">
                  {selectedPolicy.payments.map((payment: any) => (
                    <div key={payment.id} className="text-sm bg-gray-50 p-2 rounded">
                      {formatCurrency(payment.amount)} - {formatDate(payment.paidAt || payment.createdAt)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </TeamsModal>
    </div>
  )
} 