// ===== ОСНОВНЫЕ ТИПЫ =====

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: 'REALTOR' | 'ADMIN'
  avatar?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PropertyImage {
  id: string
  url: string
  alt?: string
  isMain: boolean
}

export interface Property {
  id: string
  title: string
  description?: string
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'COMMERCIAL' | 'ROOM'
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DRAFT'
  address: string
  city: string
  district?: string
  latitude?: number
  longitude?: number
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
  images: PropertyImage[]
  ownerId: string
  owner?: User
  createdAt: Date
  updatedAt: Date
}

// ===== МОДУЛИ МОЗАЙКИ M2 =====

// 📝 Конструктор договора
export interface ContractTemplate {
  id: string
  name: string
  description?: string
  content: string
  variables: Record<string, any>
  isDefault: boolean
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// 🔍 Скоринг арендатора
export interface TenantScoring {
  id: string
  fullName: string
  passport: string
  birthDate: Date
  score: number // 0-1000
  riskLevel: 'low' | 'medium' | 'high'
  factors: Record<string, any>
  recommendations?: string
  nbkiData?: Record<string, any>
  okbData?: Record<string, any>
  fsspData?: Record<string, any>
  realtorId: string
  contractId?: string
  createdAt: Date
  updatedAt: Date
}

// 📋 Опись имущества
export interface PropertyInventory {
  id: string
  items: InventoryItem[]
  totalValue: number
  aiAnalysis?: Record<string, any>
  photos: string[]
  propertyId: string
  contractId?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryItem {
  name: string
  description: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  estimatedValue: number
  category: string
  brand?: string
  model?: string
}

// ✍️ Электронная подпись
export interface DigitalSignature {
  id: string
  documentType: string
  documentId: string
  documentUrl: string
  status: 'pending' | 'signed' | 'expired'
  signedAt?: Date
  signatureData?: Record<string, any>
  signers: Signer[]
  signatures?: Record<string, any>
  contractId?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Signer {
  id: string
  name: string
  email: string
  phone?: string
  role: 'landlord' | 'tenant' | 'realtor'
  signedAt?: Date
}

// 📤 Мультилистинг
export interface Multilisting {
  id: string
  propertyId: string
  platforms: Platform[]
  listings: Listing[]
  aiDescription?: string
  aiTags: string[]
  optimization?: Record<string, any>
  views: number
  contacts: number
  realtorId: string
  createdAt: Date
  updatedAt: Date
}

export interface Platform {
  name: string
  status: 'pending' | 'active' | 'rejected' | 'completed'
  url?: string
  externalId?: string
}

export interface Listing {
  platform: string
  url: string
  externalId?: string
  status: 'active' | 'inactive' | 'deleted'
}

// 🛡️ Страховка аренды
export interface RentalInsurance {
  id: string
  coverage: number
  premium: number
  period: number
  recommended: boolean
  reason?: string
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  contractId: string
  scoringId?: string
  createdAt: Date
  updatedAt: Date
}

// 🏦 Безопасный залог (Эскроу)
export interface EscrowAccount {
  id: string
  amount: number
  currency: string
  commission: number
  status: 'pending' | 'active' | 'released' | 'refunded'
  depositedAt?: Date
  releasedAt?: Date
  contractId: string
  scoringId?: string
  createdAt: Date
  updatedAt: Date
}

// 💰 Оклад риелтора (пассивный доход)
export interface RealtorSalary {
  id: string
  monthlyAmount: number
  commission: number
  startDate: Date
  endDate?: Date
  status: 'active' | 'paused' | 'terminated'
  realtorId: string
  propertyId: string
  createdAt: Date
  updatedAt: Date
}

// 🤝 М2 × Яндекс Аренда
export interface YandexRentSubmission {
  id: string
  commission: number
  status: 'submitted' | 'approved' | 'rejected' | 'completed'
  objectData: Record<string, any>
  enhancedFeatures: Record<string, any>
  yandexId?: string
  views: number
  contacts: number
  propertyId: string
  realtorId: string
  createdAt: Date
  updatedAt: Date
}

// ===== API ТИПЫ =====

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ===== ФОРМЫ =====

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface PropertyForm {
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

// ===== ДАШБОРД ТИПЫ =====

export interface DashboardStats {
  totalProperties: number
  activeListings: number
  monthlyRevenue: number
  totalDeals: number
  averageCommission: number
  passiveIncome: number
}

export interface RealtorProfile {
  user: User
  stats: DashboardStats
  recentDeals: any[]
  upcomingTasks: any[]
}

// ===== БРОНИРОВАНИЯ =====

export interface Booking {
  id: string
  propertyId: string
  tenantId: string
  realtorId: string
  startDate: Date
  endDate: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  totalAmount: number
  deposit: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BookingWithDetails extends Booking {
  property: Property
  tenant: User
  realtor: User
}