import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// POST /api/insurance/calculate - рассчитать стоимость страхования
export async function POST(request: NextRequest) {
  try {
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      insuredAmount,
      propertyType,
      propertyAge,
      location,
      coveragePeriod
    } = body

    // Базовые тарифы для разных типов страхования
    const baseRates = {
      PROPERTY: 0.015, // 1.5% от страховой суммы
      LIABILITY: 0.008, // 0.8% от страховой суммы
      RENTAL_INCOME: 0.025, // 2.5% от страховой суммы
      LEGAL_PROTECTION: 0.012, // 1.2% от страховой суммы
      COMPREHENSIVE: 0.022 // 2.2% от страховой суммы
    }

    // Коэффициенты риска
    const riskFactors = {
      propertyType: {
        APARTMENT: 1.0,
        HOUSE: 1.2,
        COMMERCIAL: 1.5,
        LAND: 0.8
      },
      propertyAge: {
        new: 0.9, // до 5 лет
        medium: 1.0, // 5-15 лет
        old: 1.3 // более 15 лет
      },
      location: {
        center: 1.1,
        residential: 1.0,
        outskirts: 0.9
      }
    }

    // Определяем возраст недвижимости
    let ageFactor = riskFactors.propertyAge.medium
    if (propertyAge <= 5) {
      ageFactor = riskFactors.propertyAge.new
    } else if (propertyAge > 15) {
      ageFactor = riskFactors.propertyAge.old
    }

    // Базовый тариф
    const baseRate = baseRates[type as keyof typeof baseRates] || baseRates.PROPERTY
    
    // Применяем коэффициенты риска
    const propertyTypeFactor = riskFactors.propertyType[propertyType as keyof typeof riskFactors.propertyType] || 1.0
    const locationFactor = riskFactors.location[location as keyof typeof riskFactors.location] || 1.0
    
    // Рассчитываем премию
    let premium = insuredAmount * baseRate * propertyTypeFactor * ageFactor * locationFactor
    
    // Корректировка по периоду страхования (годовая база)
    const periodFactor = coveragePeriod / 12
    premium = premium * periodFactor
    
    // Минимальная премия
    const minPremium = 1000
    premium = Math.max(premium, minPremium)
    
    // Франшиза (обычно 5-10% от страховой суммы)
    const deductible = insuredAmount * 0.05

    // Предложения от разных страховых компаний
    const companies = [
      {
        name: 'Росгосстрах',
        premium: premium * 0.95,
        rating: 4.8,
        features: ['Быстрое урегулирование', 'Широкая сеть офисов']
      },
      {
        name: 'АльфаСтрахование',
        premium: premium * 1.0,
        rating: 4.6,
        features: ['Онлайн-оформление', 'Мобильное приложение']
      },
      {
        name: 'Сбербанк Страхование',
        premium: premium * 1.05,
        rating: 4.7,
        features: ['Интеграция с банком', 'Персональный менеджер']
      },
      {
        name: 'ВТБ Страхование',
        premium: premium * 0.98,
        rating: 4.5,
        features: ['Гибкие условия', 'Скидки для клиентов банка']
      }
    ]

    return NextResponse.json({
      calculation: {
        insuredAmount: parseFloat(insuredAmount),
        premium: Math.round(premium),
        deductible: Math.round(deductible),
        period: coveragePeriod
      },
      companies,
      factors: {
        baseRate,
        propertyTypeFactor,
        ageFactor,
        locationFactor,
        periodFactor
      }
    })
  } catch (error) {
    console.error('Error calculating insurance premium:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 