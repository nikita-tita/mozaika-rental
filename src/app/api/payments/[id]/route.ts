import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface RouteContext {
  params: { id: string }
}

// GET /api/payments/[id] - Получить конкретный платеж
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

    const paymentId = params.id

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        OR: [
          { userId: user.userId },
          { property: { ownerId: user.userId } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
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
                email: true
              }
            }
          }
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true
          }
        },
        contract: {
          select: {
            id: true,
            status: true,
            monthlyRent: true,
            deposit: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Платеж не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: payment
    })

  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// PATCH /api/payments/[id] - Обновить статус платежа
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

    const paymentId = params.id
    const body = await request.json()
    const { status, providerId, providerData, paidAt } = body

    // Проверяем существование платежа и права доступа
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        OR: [
          { userId: user.userId },
          { property: { ownerId: user.userId } }
        ]
      }
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Платеж не найден' },
        { status: 404 }
      )
    }

    // Определяем разрешенные переходы статусов
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['PROCESSING', 'CANCELLED', 'COMPLETED'],
      PROCESSING: ['COMPLETED', 'FAILED', 'CANCELLED'],
      COMPLETED: ['REFUNDED'],
      FAILED: ['PENDING'],
      CANCELLED: ['PENDING'],
      REFUNDED: []
    }

    if (status) {
      const currentStatus = payment.status
      const allowedStatuses = allowedTransitions[currentStatus] || []

      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Недопустимое изменение статуса' },
          { status: 400 }
        )
      }
    }

    // Обновляем платеж
    const updateData: any = {}

    if (status) {
      updateData.status = status
      
      // При завершении платежа устанавливаем дату оплаты
      if (status === 'COMPLETED' && !payment.paidAt) {
        updateData.paidAt = paidAt ? new Date(paidAt) : new Date()
      }
    }

    if (providerId) {
      updateData.providerId = providerId
    }

    if (providerData) {
      updateData.providerData = providerData
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
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
      data: updatedPayment,
      message: 'Платеж обновлен'
    })

  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/[id] - Отменить платеж
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

    const paymentId = params.id

    // Проверяем платеж
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: user.userId,
        status: {
          in: ['PENDING', 'FAILED'] // Можно отменять только ожидающие или неудачные платежи
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Платеж не найден или его нельзя отменить' },
        { status: 404 }
      )
    }

    // Обновляем статус на CANCELLED вместо удаления
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Платеж отменен'
    })

  } catch (error) {
    console.error('Payment cancellation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}