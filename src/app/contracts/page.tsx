'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { FileText, Calendar, CheckCircle, XCircle, Clock, AlertCircle, MapPin } from 'lucide-react'
import { ContractWithDetails } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

const statusOptions = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'ACTIVE', label: 'Активен' },
  { value: 'EXPIRED', label: 'Истек' },
  { value: 'TERMINATED', label: 'Расторгнут' }
]

const roleOptions = [
  { value: 'tenant', label: 'Мои договоры (как арендатор)' },
  { value: 'landlord', label: 'Договоры моей недвижимости' }
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'ALL',
    role: 'tenant'
  })

  useEffect(() => {
    fetchContracts()
  }, [filters])

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/contracts?${params}`)
      const data = await response.json()

      if (data.success) {
        setContracts(data.data)
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (contractId: string, newStatus: string) => {
    const confirmMessages = {
      ACTIVE: 'Вы уверены, что хотите подписать договор? Это действие нельзя отменить.',
      TERMINATED: 'Вы уверены, что хотите расторгнуть договор?',
      EXPIRED: 'Отметить договор как истекший?'
    }

    const message = confirmMessages[newStatus as keyof typeof confirmMessages]
    if (message && !confirm(message)) {
      return
    }

    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchContracts() // Перезагружаем список
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error updating contract:', error)
      alert('Ошибка при обновлении договора')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'TERMINATED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Черновик'
      case 'ACTIVE':
        return 'Активен'
      case 'EXPIRED':
        return 'Истек'
      case 'TERMINATED':
        return 'Расторгнут'
      default:
        return status
    }
  }

  const canSign = (contract: ContractWithDetails, userRole: string) => {
    return contract.status === 'DRAFT'
  }

  const canTerminate = (contract: ContractWithDetails, userRole: string) => {
    return contract.status === 'SIGNED'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600 mr-8">
                M²
              </Link>
              <nav className="hidden md:flex md:space-x-8">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  Панель управления
                </Link>
                <Link href="/properties" className="text-gray-500 hover:text-gray-700">
                  Недвижимость
                </Link>
                <Link href="/bookings" className="text-gray-500 hover:text-gray-700">
                  Бронирования
                </Link>
                <Link href="/contracts" className="text-primary-600 font-medium">
                  Договоры
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select
                label="Тип договоров"
                options={roleOptions}
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Select
                label="Статус"
                options={statusOptions}
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Договоры аренды
          </h1>
          <p className="text-gray-600">
            Всего: {contracts.length}
          </p>
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Договоры не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.role === 'tenant' 
                ? 'У вас пока нет подписанных договоров' 
                : 'Для вашей недвижимости пока нет договоров'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                userRole={filters.role}
                onStatusChange={handleStatusChange}
                canSign={canSign(contract, filters.role)}
                canTerminate={canTerminate(contract, filters.role)}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface ContractCardProps {
  contract: ContractWithDetails
  userRole: string
  onStatusChange: (contractId: string, status: string) => void
  canSign: boolean
  canTerminate: boolean
  getStatusIcon: (status: string) => React.ReactNode
  getStatusText: (status: string) => string
}

function ContractCard({ 
  contract, 
  userRole, 
  onStatusChange, 
  canSign,
  canTerminate,
  getStatusIcon, 
  getStatusText 
}: ContractCardProps) {
  const mainImage = contract.property.images[0]?.url || '/placeholder-property.jpg'
  const otherUser = userRole === 'tenant' ? contract.property.owner : contract.tenant

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Property Image */}
          <div className="lg:w-48 h-32 lg:h-48 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={mainImage}
              alt={contract.property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contract Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Link 
                  href={`/contracts/${contract.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                >
                  Договор №{contract.id.slice(-8)}
                </Link>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(contract.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(contract.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {contract.property.title}
              </div>

              <div className="text-sm text-gray-600">
                {contract.property.address}, {contract.property.city}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {userRole === 'tenant' ? 'Арендодатель' : 'Арендатор'}
                </p>
                <p className="font-medium">
                  {otherUser?.firstName} {otherUser?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {otherUser?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Период аренды</p>
                <p className="font-medium">
                  {formatDate(new Date(contract.startDate))} — {formatDate(new Date(contract.endDate))}
                </p>
                <div className="flex space-x-4">
                  <div>
                    <p className="text-sm text-gray-600">Ежемесячно</p>
                    <p className="font-bold text-primary-600">
                      {formatPrice(Number(contract.monthlyRent))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Залог</p>
                    <p className="font-medium">
                      {formatPrice(Number(contract.deposit))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {contract.signedAt && (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  Подписан: {formatDate(new Date(contract.signedAt))}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              <Link href={`/contracts/${contract.id}`}>
                <Button size="sm" variant="outline">
                  Просмотреть
                </Button>
              </Link>

              {canSign && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(contract.id, 'SIGNED')}
                >
                  Подписать
                </Button>
              )}

              {canTerminate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(contract.id, 'CANCELLED')}
                >
                  Расторгнуть
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}