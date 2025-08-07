import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      throw new Error('Unauthorized: No token provided')
    }

    const user = verifyJWTToken(token)
    if (!user) {
      throw new Error('Unauthorized: Invalid token')
    }

    const body = await request.json()
    const dealId = params.id

    logger.info('Updating deal status', { userId: user.userId, dealId, newStatus: body.status }, user.userId, requestId)

    // Проверяем, что сделка существует и принадлежит пользователю
    const existingDeal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        property: true,
        tenant: true,
        landlord: true
      }
    })

    if (!existingDeal) {
      throw new Error(`Сделка не найдена: ${dealId}`)
    }

    if (existingDeal.userId !== user.userId) {
      throw new Error(`Доступ к сделке запрещен: ${dealId}`)
    }

    // Валидация статуса
    const validStatuses = ['DRAFT', 'NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(body.status)) {
      throw new Error(`Неверный статус: ${body.status}`)
    }

    // Проверяем логику переходов статусов
    const currentStatus = existingDeal.status
    const newStatus = body.status

    // Логика переходов статусов
    const allowedTransitions: Record<string, string[]> = {
      'DRAFT': ['NEW', 'CANCELLED'],
      'NEW': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [], // Завершенные сделки нельзя изменить
      'CANCELLED': [] // Отмененные сделки нельзя изменить
    }

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Недопустимый переход статуса с "${currentStatus}" на "${newStatus}"`)
    }

    // Обновляем статус сделки
    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        status: newStatus,
        updatedAt: new Date()
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            type: true,
            price: true
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
        landlord: {
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

    logger.info('Deal status updated successfully', { dealId, oldStatus: currentStatus, newStatus }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      message: `Статус сделки изменен на "${newStatus}"`,
      data: updatedDeal
    })
  }, {
    method: 'PATCH',
    path: `/api/deals/${params.id}`,
    userId: undefined,
    requestId
  })
} 