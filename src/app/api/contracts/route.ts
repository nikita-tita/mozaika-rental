import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/contracts - Получить договоры пользователя
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role') || 'tenant' // 'tenant' или 'landlord'

    let whereClause: any = {}

    if (role === 'tenant') {
      // Договоры пользователя как арендатора
      whereClause.tenantId = user.userId
    } else {
      // Договоры недвижимости пользователя как арендодателя
      whereClause.property = {
        ownerId: user.userId
      }
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const contracts = await prisma.contract.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        booking: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            message: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: contracts
    })

  } catch (error) {
    console.error('Contracts fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/contracts - Создать договор (обычно вызывается автоматически)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'LANDLORD') {
      return NextResponse.json(
        { success: false, error: 'Только арендодатели могут создавать договоры' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { bookingId, terms } = body

    // Проверяем бронирование
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        status: 'CONFIRMED',
        property: {
          ownerId: user.userId
        }
      },
      include: {
        property: true,
        tenant: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Бронирование не найдено или недоступно для создания договора' },
        { status: 404 }
      )
    }

    // Проверяем, нет ли уже договора для этого бронирования
    const existingContract = await prisma.contract.findFirst({
      where: { bookingId }
    })

    if (existingContract) {
      return NextResponse.json(
        { success: false, error: 'Договор для этого бронирования уже существует' },
        { status: 409 }
      )
    }

    // Создаем договор
    const contract = await prisma.contract.create({
      data: {
        bookingId,
        propertyId: booking.propertyId,
        tenantId: booking.tenantId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        monthlyRent: booking.property.pricePerMonth,
        deposit: booking.property.deposit || booking.property.pricePerMonth,
        terms: terms || generateDefaultTerms(booking),
        status: 'DRAFT'
      },
      include: {
        property: {
          include: {
            images: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        booking: true
      }
    })

    return NextResponse.json({
      success: true,
      data: contract,
      message: 'Договор успешно создан'
    })

  } catch (error) {
    console.error('Contract creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Функция генерации стандартных условий договора
function generateDefaultTerms(booking: any): string {
  const propertyType = booking.property.type === 'APARTMENT' ? 'квартиру' : 
                      booking.property.type === 'HOUSE' ? 'дом' : 
                      booking.property.type === 'STUDIO' ? 'студию' : 'помещение'

  return `ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ

1. ПРЕДМЕТ ДОГОВОРА
Арендодатель предоставляет во временное владение и пользование ${propertyType} по адресу: ${booking.property.address}, ${booking.property.city}.

Общая площадь: ${booking.property.area} м²
${booking.property.rooms ? `Количество комнат: ${booking.property.rooms}` : ''}

2. СРОК АРЕНДЫ
Договор действует с ${new Date(booking.startDate).toLocaleDateString('ru-RU')} по ${new Date(booking.endDate).toLocaleDateString('ru-RU')}.

3. АРЕНДНАЯ ПЛАТА
Размер ежемесячной арендной платы составляет ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(booking.property.pricePerMonth))}.

Залог: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(booking.property.deposit || booking.property.pricePerMonth))}.

${booking.property.utilities ? 'Коммунальные услуги включены в стоимость аренды.' : 'Коммунальные услуги оплачиваются арендатором отдельно.'}

4. ПРАВА И ОБЯЗАННОСТИ СТОРОН
4.1. Арендодатель обязуется:
- Предоставить недвижимость в исправном состоянии
- Не вмешиваться в пользование недвижимостью арендатором
- Проводить капитальный ремонт за свой счет

4.2. Арендатор обязуется:
- Использовать недвижимость только для проживания
- Поддерживать недвижимость в чистоте и порядке
- Своевременно оплачивать арендную плату
- Не производить перепланировку без согласия арендодателя

5. ПРОЧИЕ УСЛОВИЯ
5.1. Договор может быть расторгнут досрочно по взаимному согласию сторон.
5.2. При расторжении договора залог возвращается за вычетом ущерба (при наличии).
5.3. Споры решаются путем переговоров, при невозможности - в судебном порядке.

6. ПОДПИСИ СТОРОН
Настоящий договор вступает в силу с момента подписания обеими сторонами.`
}