'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  TeamsButton, 
  TeamsInput, 
  TeamsCard, 
  TeamsBadge,
  TeamsModal,
  TeamsNavigation,
  TeamsSkeleton
} from '@/components/ui/teams'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Edit,
  Download,
  User,
  MapPin,
  DollarSign
} from 'lucide-react'
import { ContractWithDetails } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string
  
  const [contract, setContract] = useState<ContractWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    content: '',
    monthlyRent: '',
    deposit: ''
  })

  useEffect(() => {
    if (contractId) {
      fetchContract()
    }
  }, [contractId])

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`)
      const data = await response.json()

      if (data.success) {
        setContract(data.data)
        setEditData({
          content: data.data.content || '',
          monthlyRent: data.data.monthlyRent?.toString() || '',
          deposit: data.data.deposit?.toString() || ''
        })
      } else {
        alert('Договор не найден')
        router.push('/contracts')
      }
    } catch (error) {
      console.error('Error fetching contract:', error)
      alert('Ошибка при загрузке договора')
      router.push('/contracts')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    const confirmMessages = {
      SIGNED: 'Вы уверены, что хотите подписать договор? Это действие нельзя отменить.',
      CANCELLED: 'Вы уверены, что хотите расторгнуть договор?'
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
        setContract(data.data)
        if (newStatus === 'SIGNED') {
          alert('Договор успешно подписан!')
        }
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error updating contract:', error)
      alert('Ошибка при обновлении договора')
    }
  }

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editData.content,
          monthlyRent: editData.monthlyRent,
          deposit: editData.deposit
        })
      })

      const data = await response.json()

      if (data.success) {
        setContract(data.data)
        setEditing(false)
        alert('Договор обновлен')
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error updating contract:', error)
      alert('Ошибка при обновлении договора')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Договор не найден
          </h2>
          <Link href="/contracts">
            <TeamsButton>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к договорам
            </TeamsButton>
          </Link>
        </div>
      </div>
    )
  }

  const isLandlord = contract.property.ownerId === contract.tenant.id // Нужно получить текущего пользователя
  const canEdit = contract.status === 'DRAFT' && isLandlord
  const canSign = contract.status === 'DRAFT'
  const canTerminate = contract.status === 'SIGNED'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/contracts"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к договорам
            </Link>

            <div className="flex space-x-2">
              <TeamsButton variant="outline" onClick={handlePrint}>
                <Download className="h-4 w-4 mr-2" />
                Скачать PDF
              </TeamsButton>

              {canEdit && !editing && (
                <TeamsButton variant="outline" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </TeamsButton>
              )}

              {canSign && (
                <TeamsButton onClick={() => handleStatusChange('SIGNED')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Подписать договор
                </TeamsButton>
              )}

              {canTerminate && (
                <TeamsButton variant="outline" onClick={() => handleStatusChange('CANCELLED')}>
                  Расторгнуть договор
                </TeamsButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Contract Header */}
        <div className="bg-white rounded-lg shadow mb-6 print:shadow-none">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Договор аренды №{contract.id.slice(-8)}
                  </h1>
                  <p className="text-gray-600">
                    Создан: {formatDate(new Date(contract.createdAt))}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  contract.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                  contract.status === 'SIGNED' ? 'bg-green-100 text-green-800' :
                  contract.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  contract.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contract.status === 'DRAFT' && 'Черновик'}
                  {contract.status === 'SIGNED' && 'Подписан'}
                  {contract.status === 'COMPLETED' && 'Завершен'}
                  {contract.status === 'CANCELLED' && 'Отменен'}
                </div>
                {contract.signedAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    Подписан: {formatDate(new Date(contract.signedAt))}
                  </p>
                )}
              </div>
            </div>

            {/* Property and Parties Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Недвижимость</h3>
                </div>
                <p className="text-sm font-medium">{contract.property.title}</p>
                <p className="text-sm text-gray-600">
                  {contract.property.address}, {contract.property.city}
                </p>
                <p className="text-sm text-gray-600">
                  {contract.property.area} м²
                  {contract.property.rooms && `, ${contract.property.rooms} комн.`}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Арендодатель</h3>
                </div>
                <p className="text-sm font-medium">
                  {contract.property.owner?.firstName} {contract.property.owner?.lastName}
                </p>
                <p className="text-sm text-gray-600">{contract.property.owner?.email}</p>
                {contract.property.owner?.phone && (
                  <p className="text-sm text-gray-600">{contract.property.owner.phone}</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Арендатор</h3>
                </div>
                <p className="text-sm font-medium">
                  {contract.tenant.firstName} {contract.tenant.lastName}
                </p>
                <p className="text-sm text-gray-600">{contract.tenant.email}</p>
                {contract.tenant.phone && (
                  <p className="text-sm text-gray-600">{contract.tenant.phone}</p>
                )}
              </div>
            </div>

            {/* Financial Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6 mt-6">
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Период аренды</h3>
                </div>
                <p className="text-sm">
                  <span className="font-medium">С:</span> {formatDate(new Date(contract.startDate))}
                </p>
                <p className="text-sm">
                  <span className="font-medium">По:</span> {formatDate(new Date(contract.endDate))}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Арендная плата</h3>
                </div>
                {editing ? (
                  <TeamsInput
                    type="number"
                    value={editData.monthlyRent}
                    onChange={(e) => setEditData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                    className="mb-2"
                  />
                ) : (
                  <p className="text-lg font-bold text-primary-600">
                    {formatPrice(Number(contract.monthlyRent))} / мес
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Залог</h3>
                </div>
                {editing ? (
                  <TeamsInput
                    type="number"
                    value={editData.deposit}
                    onChange={(e) => setEditData(prev => ({ ...prev, deposit: e.target.value }))}
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {formatPrice(Number(contract.deposit))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contract Terms */}
        <div className="bg-white rounded-lg shadow print:shadow-none">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Условия договора</h2>
              {editing && (
                <div className="flex space-x-2">
                  <TeamsButton variant="outline" onClick={() => setEditing(false)}>
                    Отмена
                  </TeamsButton>
                  <TeamsButton onClick={handleSaveEdit}>
                    Сохранить
                  </TeamsButton>
                </div>
              )}
            </div>

            {editing ? (
              <textarea
                value={editData.content}
                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono"
              />
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900">
                  {contract.content}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Signature Section */}
        {contract.status === 'SIGNED' && contract.signedAt && (
          <div className="bg-green-50 rounded-lg p-6 mt-6 print:shadow-none">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <h3 className="font-medium text-green-900">Договор подписан</h3>
                <p className="text-sm text-green-700">
                  Дата подписания: {formatDate(new Date(contract.signedAt))}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}