import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { NotificationService } from '@/lib/notifications/service'
import { NotificationType, NotificationChannel, NotificationPriority } from '@/lib/notifications/types'

// GET /api/bookings - Получить бронирования пользователя
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
    const role = searchParams.get('role') || 'realtor' // 'realtor' или 'admin'

    let whereClause: any = {}

    if (role === 'realtor') {
      // Бронирования риелтора
      whereClause.realtorId = user.userId
    } else if (role === 'admin') {
      // Администратор видит все бронирования
      whereClause = {}
    } else {
      // По умолчанию показываем бронирования риелтора
      whereClause.realtorId = user.userId
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const bookings = await prisma.booking.findMany({
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
        contract: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Создать новое бронирование
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
    if (!user || (user.role !== 'REALTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Только риелторы и администраторы могут создавать бронирования' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { propertyId, startDate, endDate, message } = body

    // Валидация
    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { success: false, error: 'Дата окончания должна быть позже даты начала' },
        { status: 400 }
      )
    }

    if (start < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Дата начала не может быть в прошлом' },
        { status: 400 }
      )
    }

    // Проверяем существование недвижимости
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Недвижимость не найдена' },
        { status: 404 }
      )
    }

    if (property.status !== 'AVAILABLE') {
      return NextResponse.json(
        { success: false, error: 'Недвижимость недоступна для бронирования' },
        { status: 400 }
      )
    }

    if (property.ownerId === user.userId) {
      return NextResponse.json(
        { success: false, error: 'Нельзя бронировать собственную недвижимость' },
        { status: 400 }
      )
    }

    // Проверяем пересечения с другими бронированиями
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        propertyId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } }
            ]
          },
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } }
            ]
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } }
            ]
          }
        ]
      }
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { success: false, error: 'На выбранные даты уже есть бронирование' },
        { status: 409 }
      )
    }

    // Вычисляем общую стоимость
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = Number(property.pricePerMonth) * (days / 30) // Примерная стоимость

    // Создаем бронирование
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        tenantId: user.userId,
        startDate: start,
        endDate: end,
        totalPrice,
        message: message || null,
        status: 'PENDING'
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

    // Отправляем уведомление арендодателю о новом бронировании
    try {
      await NotificationService.createNotification({
        type: NotificationType.BOOKING_CREATED,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        priority: NotificationPriority.HIGH,
        recipientId: property.ownerId,
        title: 'Новое бронирование',
        message: `${booking.tenant.firstName} ${booking.tenant.lastName} забронировал вашу недвижимость "${property.title}"`,
        data: {
          bookingId: booking.id,
          propertyId: property.id,
          tenantName: `${booking.tenant.firstName} ${booking.tenant.lastName}`,
          propertyTitle: property.title,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice
        }
      })
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError)
      // Не блокируем создание бронирования из-за ошибки уведомления
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Бронирование успешно создано'
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}