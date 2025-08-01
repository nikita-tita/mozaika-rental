'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { BookingWithDetails } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

const statusOptions = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'PENDING', label: 'Ожидает подтверждения' },
  { value: 'CONFIRMED', label: 'Подтверждено' },
  { value: 'CANCELLED', label: 'Отменено' },
  { value: 'COMPLETED', label: 'Завершено' }
]

const roleOptions = [
  { value: 'tenant', label: 'Мои бронирования' },
  { value: 'landlord', label: 'Бронирования моей недвижимости' }
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'ALL',
    role: 'tenant'
  })

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/bookings?${params}`)
      const data = await response.json()

      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchBookings() // Перезагружаем список
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Ошибка при обновлении бронирования')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает подтверждения'
      case 'CONFIRMED':
        return 'Подтверждено'
      case 'CANCELLED':
        return 'Отменено'
      case 'COMPLETED':
        return 'Завершено'
      default:
        return status
    }
  }

  const canUpdateStatus = (booking: BookingWithDetails, userRole: string) => {
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return false
    }
    
    return userRole === 'landlord' || booking.status === 'PENDING'
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
                <Link href="/bookings" className="text-primary-600 font-medium">
                  Бронирования
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
                label="Тип бронирований"
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
            Бронирования
          </h1>
          <p className="text-gray-600">
            Всего: {bookings.length}
          </p>
        </div>

        {/* Bookings List */}
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
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Бронирования не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.role === 'tenant' 
                ? 'У вас пока нет бронирований' 
                : 'Никто пока не забронировал вашу недвижимость'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole={filters.role}
                onStatusChange={handleStatusChange}
                canUpdate={canUpdateStatus(booking, filters.role)}
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

interface BookingCardProps {
  booking: BookingWithDetails
  userRole: string
  onStatusChange: (bookingId: string, status: string) => void
  canUpdate: boolean
  getStatusIcon: (status: string) => React.ReactNode
  getStatusText: (status: string) => string
}

function BookingCard({ 
  booking, 
  userRole, 
  onStatusChange, 
  canUpdate, 
  getStatusIcon, 
  getStatusText 
}: BookingCardProps) {
  const mainImage = booking.property.images[0]?.url || '/placeholder-property.jpg'
  const otherUser = userRole === 'tenant' ? booking.property.owner : booking.tenant

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Property Image */}
          <div className="lg:w-48 h-32 lg:h-48 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={mainImage}
              alt={booking.property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Link 
                  href={`/properties/${booking.property.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                >
                  {booking.property.title}
                </Link>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(booking.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(booking.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.property.address}, {booking.property.city}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {userRole === 'tenant' ? 'Арендодатель' : 'Арендатор'}
                </p>
                <p className="font-medium">
                  {otherUser.firstName} {otherUser.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {otherUser.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Период аренды</p>
                <p className="font-medium">
                  {formatDate(new Date(booking.startDate))} — {formatDate(new Date(booking.endDate))}
                </p>
                <p className="text-lg font-bold text-primary-600">
                  {formatPrice(Number(booking.totalPrice))}
                </p>
              </div>
            </div>

            {booking.message && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Сообщение:</p>
                <p className="text-sm">{booking.message}</p>
              </div>
            )}

            {/* Actions */}
            {canUpdate && (
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                {booking.status === 'PENDING' && userRole === 'landlord' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onStatusChange(booking.id, 'CONFIRMED')}
                    >
                      Подтвердить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusChange(booking.id, 'CANCELLED')}
                    >
                      Отклонить
                    </Button>
                  </>
                )}

                {booking.status === 'PENDING' && userRole === 'tenant' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(booking.id, 'CANCELLED')}
                  >
                    Отменить
                  </Button>
                )}

                {booking.status === 'CONFIRMED' && userRole === 'landlord' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusChange(booking.id, 'COMPLETED')}
                  >
                    Завершить
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}