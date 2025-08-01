import { User, Property, Booking, Contract, Review, PropertyImage } from '@prisma/client'

// Расширенные типы для API ответов
export type PropertyWithImages = Property & {
  images: PropertyImage[]
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>
  _count?: {
    reviews: number
  }
  averageRating?: number
}

export type PropertyWithOwner = Property & {
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'avatar'>
  images: PropertyImage[]
}

export type BookingWithDetails = Booking & {
  property: PropertyWithImages
  tenant: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>
}

export type ContractWithDetails = Contract & {
  property: PropertyWithImages
  tenant: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>
  booking: Booking
}

export type ReviewWithAuthor = Review & {
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>
}

export type UserProfile = Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'phone' | 'role' | 'avatar' | 'verified' | 'createdAt'>

// Типы для форм
export interface PropertyFormData {
  title: string
  description?: string
  type: Property['type']
  address: string
  city: string
  district?: string
  area: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  totalFloors?: number
  pricePerMonth: number
  deposit?: number
  utilities: boolean
  amenities: string[]
}

export interface UserRegistrationData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: User['role']
}

export interface BookingFormData {
  propertyId: string
  startDate: Date
  endDate: Date
  message?: string
}

// API ответы
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Фильтры поиска
export interface PropertySearchFilters {
  type?: Property['type']
  city?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  rooms?: number
  amenities?: string[]
  page?: number
  limit?: number
  sortBy?: 'price' | 'area' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}