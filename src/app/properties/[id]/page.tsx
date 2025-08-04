'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeamsButton, TeamsCard, TeamsBadge, TeamsNavigation, TeamsModal } from '@/components/ui/teams'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Users, 
  Home,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Star,
  Heart,
  Wifi,
  Tv,
  Coffee,
  Wind,
  Car
} from 'lucide-react'
import { PropertyWithImages, ReviewWithAuthor } from '@/types'
import { formatPrice, formatArea, formatDate } from '@/lib/utils'
import BookingForm from '@/components/bookings/BookingForm'

const amenityIcons: Record<string, any> = {
  'Wi-Fi': Wifi,
  'Телевизор': Tv,
  'Кофеварка': Coffee,
  'Кондиционер': Wind,
  'Парковка': Car,
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<PropertyWithImages | null>(null)
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
      fetchReviews()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties?id=${propertyId}`)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setProperty(data.data[0])
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/reviews`)
      const data = await response.json()

      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Недвижимость не найдена
          </h2>
          <Link href="/properties">
            <TeamsButton>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к поиску
            </TeamsButton>
          </Link>
        </div>
      </div>
    )
  }

  const mainImages = property.images.length > 0 ? property.images : [{ url: '/placeholder-property.jpg', alt: property.title }]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/properties"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Images Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-1">
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                <img
                  src={mainImages[currentImageIndex]?.url}
                  alt={mainImages[currentImageIndex]?.alt || property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {mainImages.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
                      onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : mainImages.length - 1)}
                    >
                      ←
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
                      onClick={() => setCurrentImageIndex(currentImageIndex < mainImages.length - 1 ? currentImageIndex + 1 : 0)}
                    >
                      →
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {mainImages.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {mainImages.length > 1 && (
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 gap-2 h-96 lg:h-[500px]">
                  {mainImages.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                      onClick={() => setCurrentImageIndex(index + 1)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${property.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 3 && mainImages.length > 5 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold">
                          +{mainImages.length - 5} еще
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}, {property.city}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {property.rooms && (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        {property.rooms} комн.
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {formatArea(property.area)}
                    </div>

                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms} ванн.
                      </div>
                    )}
                  </div>
                </div>

                <TeamsButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </TeamsButton>
              </div>

              {/* Property Type Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                {property.type === 'APARTMENT' && 'Квартира'}
                {property.type === 'HOUSE' && 'Дом'}
                {property.type === 'STUDIO' && 'Студия'}
                {property.type === 'COMMERCIAL' && 'Коммерческая'}
                {property.type === 'ROOM' && 'Комната'}
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Арендодатель</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {property.owner?.firstName?.charAt(0) || 'U'}{property.owner?.lastName?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-medium">
                    {property.owner?.firstName} {property.owner?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    На платформе с {formatDate(new Date())}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Описание</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Удобства</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Home
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Отзывы ({reviews.length})
                </h3>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {review.author.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {review.author.firstName} {review.author.lastName}
                          </p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm
              propertyId={property.id}
              pricePerMonth={Number(property.pricePerMonth)}
              onBookingSuccess={fetchProperty}
            />
          </div>
        </div>
      </main>
    </div>
  )
}