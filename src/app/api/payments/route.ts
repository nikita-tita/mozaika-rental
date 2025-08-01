import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/payments - Получить платежи пользователя
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
    const type = searchParams.get('type')
    const role = searchParams.get('role') || 'all' // 'tenant', 'landlord', 'all'

    let whereClause: any = {}

    if (role === 'tenant') {
      // Платежи пользователя как арендатора
      whereClause.userId = user.userId
    } else if (role === 'landlord') {
      // Платежи за недвижимость пользователя как арендодателя
      whereClause.property = {
        ownerId: user.userId
      }
    } else {
      // Все платежи, связанные с пользователем
      whereClause.OR = [
        { userId: user.userId },
        { property: { ownerId: user.userId } }
      ]
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    if (type && type !== 'ALL') {
      whereClause.type = type
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true
          }
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true
          }
        },
        contract: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: payments
    })

  } catch (error) {
    console.error('Payments fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Создать платеж
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
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      type, 
      amount, 
      currency = 'RUB', 
      description, 
      contractId, 
      bookingId, 
      propertyId, 
      dueDate,
      provider = 'manual',
      metadata 
    } = body

    // Валидация
    if (!type || !amount) {
      return NextResponse.json(
        { success: false, error: 'Тип платежа и сумма обязательны' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Сумма должна быть положительной' },
        { status: 400 }
      )
    }

    // Проверяем права доступа к связанным объектам
    if (contractId) {
      const contract = await prisma.contract.findFirst({
        where: {
          id: contractId,
          OR: [
            { tenantId: user.userId },
            { property: { ownerId: user.userId } }
          ]
        }
      })

      if (!contract) {
        return NextResponse.json(
          { success: false, error: 'Договор не найден или нет доступа' },
          { status: 404 }
        )
      }
    }

    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          OR: [
            { tenantId: user.userId },
            { property: { ownerId: user.userId } }
          ]
        }
      })

      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Бронирование не найдено или нет доступа' },
          { status: 404 }
        )
      }
    }

    // Создаем платеж
    const payment = await prisma.payment.create({
      data: {
        type,
        amount: parseFloat(amount),
        currency,
        description,
        userId: user.userId,
        contractId,
        bookingId,
        propertyId,
        dueDate: dueDate ? new Date(dueDate) : null,
        provider,
        metadata,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true
          }
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true
          }
        },
        contract: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Платеж создан'
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}