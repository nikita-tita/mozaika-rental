import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface RouteContext {
  params: { id: string }
}

// GET /api/bookings/[id] - Получить конкретное бронирование
export async function GET(request: NextRequest, { params }: RouteContext) {
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

    const bookingId = params.id

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { tenantId: user.userId },
          { property: { ownerId: user.userId } }
        ]
      },
      include: {
        property: {
          include: {
            images: {
              orderBy: { order: 'asc' }
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true
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
            phone: true,
            avatar: true
          }
        },
        contract: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Бронирование не найдено' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: booking
    })

  } catch (error) {
    console.error('Booking fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Обновить статус бронирования
export async function PATCH(request: NextRequest, { params }: RouteContext) {
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

    const bookingId = params.id
    const body = await request.json()
    const { status, message } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Статус обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование бронирования
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { tenantId: user.userId },
          { property: { ownerId: user.userId } }
        ]
      },
      include: {
        property: true,
        tenant: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Бронирование не найдено' },
        { status: 404 }
      )
    }

    // Проверяем права на изменение статуса
    const isLandlord = booking.property.ownerId === user.userId
    const isTenant = booking.tenantId === user.userId

    // Логика изменения статусов
    const allowedTransitions: Record<string, string[]> = {
      PENDING: isLandlord ? ['CONFIRMED', 'CANCELLED'] : ['CANCELLED'],
      CONFIRMED: isLandlord ? ['COMPLETED', 'CANCELLED'] : ['CANCELLED'],
      CANCELLED: [],
      COMPLETED: []
    }

    const currentStatus = booking.status
    const allowedStatuses = allowedTransitions[currentStatus] || []

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Недопустимое изменение статуса' },
        { status: 400 }
      )
    }

    // Обновляем бронирование
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...(message && { message })
      },
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
        }
      }
    })

    // При подтверждении бронирования можно создать черновик договора
    if (status === 'CONFIRMED' && !booking.contract) {
      await prisma.contract.create({
        data: {
          bookingId: booking.id,
          propertyId: booking.propertyId,
          tenantId: booking.tenantId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          monthlyRent: booking.property.pricePerMonth,
          deposit: booking.property.deposit || booking.property.pricePerMonth,
          status: 'DRAFT'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Статус бронирования обновлен'
    })

  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Удалить бронирование
export async function DELETE(request: NextRequest, { params }: RouteContext) {
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

    const bookingId = params.id

    // Проверяем существование бронирования
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId: user.userId,
        status: 'PENDING' // Можно удалять только ожидающие бронирования
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Бронирование не найдено или его нельзя удалить' },
        { status: 404 }
      )
    }

    await prisma.booking.delete({
      where: { id: bookingId }
    })

    return NextResponse.json({
      success: true,
      message: 'Бронирование удалено'
    })

  } catch (error) {
    console.error('Booking deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}