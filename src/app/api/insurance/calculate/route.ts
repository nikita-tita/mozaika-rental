import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

// POST /api/insurance/calculate - рассчитать стоимость страхования
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, insuredAmount, propertyType, location } = body

    // Базовая ставка в зависимости от типа страхования
    let baseRate = 0
    switch (type) {
      case 'PROPERTY':
        baseRate = 0.5 // 0.5% от страховой суммы
        break
      case 'LIABILITY':
        baseRate = 0.3 // 0.3% от страховой суммы
        break
      case 'RENTAL':
        baseRate = 0.8 // 0.8% от страховой суммы
        break
      case 'LEGAL':
        baseRate = 0.2 // 0.2% от страховой суммы
        break
      default:
        baseRate = 0.5
    }

    // Коэффициент в зависимости от типа недвижимости
    let propertyMultiplier = 1
    switch (propertyType) {
      case 'APARTMENT':
        propertyMultiplier = 1.0
        break
      case 'HOUSE':
        propertyMultiplier = 1.2
        break
      case 'STUDIO':
        propertyMultiplier = 0.9
        break
      case 'ROOM':
        propertyMultiplier = 0.8
        break
      default:
        propertyMultiplier = 1.0
    }

    // Коэффициент в зависимости от локации
    let locationMultiplier = 1
    if (location === 'Москва') {
      locationMultiplier = 1.3
    } else if (location === 'Санкт-Петербург') {
      locationMultiplier = 1.2
    } else {
      locationMultiplier = 1.0
    }

    // Рассчитываем премию
    const premium = (insuredAmount * baseRate * propertyMultiplier * locationMultiplier) / 100

    // Рассчитываем франшизу (обычно 5-10% от страховой суммы)
    const deductible = insuredAmount * 0.05

    return NextResponse.json({
      success: true,
      premium: Math.round(premium),
      deductible: Math.round(deductible),
      baseRate,
      propertyMultiplier,
      locationMultiplier
    })
  } catch (error) {
    console.error('Error calculating insurance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 