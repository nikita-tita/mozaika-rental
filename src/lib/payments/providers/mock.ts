import { PaymentProvider, PaymentResult, PaymentStatus, RefundResult } from '../types'

/**
 * Mock платежный провайдер для тестирования
 * Имитирует работу реального платежного шлюза
 */
export class MockPaymentProvider implements PaymentProvider {
  name = 'mock'

  async createPayment(amount: number, currency: string, metadata?: any): Promise<PaymentResult> {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Генерируем случайный ID платежа
    const paymentId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Имитируем случайные ошибки (5% вероятность)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Mock payment creation failed'
      }
    }

    return {
      success: true,
      paymentId,
      paymentUrl: `https://mock-payment.example.com/pay/${paymentId}`,
      metadata: {
        provider: 'mock',
        created: new Date().toISOString(),
        ...metadata
      }
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500))

    // Для тестирования - определяем статус по ID
    let status: PaymentStatus['status'] = 'pending'
    
    if (paymentId.includes('completed')) {
      status = 'completed'
    } else if (paymentId.includes('failed')) {
      status = 'failed'
    } else if (paymentId.includes('processing')) {
      status = 'processing'
    }

    return {
      id: paymentId,
      status,
      amount: 1000, // Mock сумма
      currency: 'RUB',
      paidAt: status === 'completed' ? new Date() : undefined,
      metadata: {
        provider: 'mock',
        checked: new Date().toISOString()
      }
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Генерируем ID возврата
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Имитируем случайные ошибки (10% вероятность)
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Mock refund failed'
      }
    }

    return {
      success: true,
      refundId,
      amount: amount || 1000,
    }
  }
}