import { PaymentProvider, PaymentConfig, SupportedProvider } from './types'
import { MockPaymentProvider } from './providers/mock'

/**
 * Фабрика для создания платежных провайдеров
 */
export class PaymentProviderFactory {
  private static providers: Map<SupportedProvider, any> = new Map([
    ['mock', MockPaymentProvider],
    // Здесь можно добавить другие провайдеры:
    // ['stripe', StripePaymentProvider],
    // ['yoomoney', YooMoneyPaymentProvider],
    // ['paypal', PayPalPaymentProvider],
  ])

  static createProvider(config: PaymentConfig): PaymentProvider {
    const ProviderClass = this.providers.get(config.provider as SupportedProvider)
    
    if (!ProviderClass) {
      throw new Error(`Unsupported payment provider: ${config.provider}`)
    }

    return new ProviderClass(config)
  }

  static getSupportedProviders(): SupportedProvider[] {
    return Array.from(this.providers.keys())
  }

  static isProviderSupported(provider: string): provider is SupportedProvider {
    return this.providers.has(provider as SupportedProvider)
  }
}

/**
 * Утилитарные функции для работы с платежами
 */
export class PaymentUtils {
  /**
   * Форматирует сумму для отображения
   */
  static formatAmount(amount: number, currency: string = 'RUB'): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount)
  }

  /**
   * Конвертирует сумму в копейки для платежных систем
   */
  static amountToMinorUnits(amount: number, currency: string = 'RUB'): number {
    // Для рублей, долларов, евро - умножаем на 100 (копейки, центы)
    const minorUnitCurrencies = ['RUB', 'USD', 'EUR', 'GBP']
    return minorUnitCurrencies.includes(currency) ? Math.round(amount * 100) : amount
  }

  /**
   * Конвертирует сумму из копеек в основные единицы
   */
  static amountFromMinorUnits(amount: number, currency: string = 'RUB'): number {
    const minorUnitCurrencies = ['RUB', 'USD', 'EUR', 'GBP']
    return minorUnitCurrencies.includes(currency) ? amount / 100 : amount
  }

  /**
   * Генерирует описание платежа
   */
  static generateDescription(type: string, propertyTitle?: string, period?: { start: Date, end: Date }): string {
    const typeNames = {
      RENT: 'Арендная плата',
      DEPOSIT: 'Залог',
      COMMISSION: 'Комиссия платформы',
      REFUND: 'Возврат средств'
    }

    let description = typeNames[type as keyof typeof typeNames] || 'Платеж'

    if (propertyTitle) {
      description += ` за ${propertyTitle}`
    }

    if (period) {
      const startStr = period.start.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
      const endStr = period.end.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
      description += ` (${startStr} - ${endStr})`
    }

    return description
  }

  /**
   * Вычисляет комиссию платформы
   */
  static calculateCommission(amount: number, rate: number = 0.05): number {
    return Math.round(amount * rate * 100) / 100
  }

  /**
   * Проверяет, можно ли отменить платеж
   */
  static canCancelPayment(status: string): boolean {
    return ['PENDING', 'FAILED'].includes(status)
  }

  /**
   * Проверяет, можно ли вернуть платеж
   */
  static canRefundPayment(status: string): boolean {
    return status === 'COMPLETED'
  }
}