export interface PaymentProvider {
  name: string
  createPayment(amount: number, currency: string, metadata?: any): Promise<PaymentResult>
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  error?: string
  metadata?: any
}

export interface PaymentStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  amount: number
  currency: string
  paidAt?: Date
  metadata?: any
}

export interface RefundResult {
  success: boolean
  refundId?: string
  amount?: number
  error?: string
}

export interface PaymentConfig {
  provider: string
  publicKey?: string
  secretKey?: string
  environment: 'sandbox' | 'production'
  webhookSecret?: string
}

export type SupportedProvider = 'stripe' | 'yoomoney' | 'paypal' | 'mock'