import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
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

    logger.info('Fetching reminders for payment', { paymentId: params.paymentId }, user.userId, requestId)

    // Проверяем, что платеж существует и принадлежит пользователю
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: {
        deal: {
          select: {
            tenant: {
              select: {
                email: true,
                phone: true
              }
            }
          }
        }
      }
    })

    if (!payment) {
      throw new Error(`Payment not found: ${params.paymentId}`)
    }

    if (payment.userId !== user.userId) {
      throw new Error(`Payment access denied: ${params.paymentId} for user ${user.userId}`)
    }

    // Получаем напоминания для платежа
    const reminders = await prisma.paymentReminder.findMany({
      where: {
        paymentId: params.paymentId
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    })

    logger.info('Reminders fetched successfully', { count: reminders.length }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: reminders
    })
  }, {
    method: 'GET',
    path: `/api/payments/${params.paymentId}/reminders`,
    userId: undefined,
    requestId
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
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

    logger.info('Creating reminder for payment', { 
      paymentId: params.paymentId, 
      reminderData: body 
    }, user.userId, requestId)

    // Проверяем, что платеж существует и принадлежит пользователю
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: {
        deal: {
          select: {
            tenant: {
              select: {
                email: true,
                phone: true
              }
            }
          }
        },
        property: {
          select: {
            title: true
          }
        }
      }
    })

    if (!payment) {
      throw new Error(`Payment not found: ${params.paymentId}`)
    }

    if (payment.userId !== user.userId) {
      throw new Error(`Payment access denied: ${params.paymentId} for user ${user.userId}`)
    }

    // Проверяем, что у арендатора есть контактные данные для отправки
    if (body.type === 'EMAIL' && !payment.deal?.tenant?.email) {
      throw new Error('Tenant email not found for email reminder')
    }

    if ((body.type === 'SMS' || body.type === 'WHATSAPP') && !payment.deal?.tenant?.phone) {
      throw new Error('Tenant phone not found for SMS/WhatsApp reminder')
    }

    // Создаем напоминание
    const reminder = await prisma.paymentReminder.create({
      data: {
        paymentId: params.paymentId,
        type: body.type,
        message: body.message,
        scheduledAt: new Date(body.scheduledAt),
        status: 'SCHEDULED',
        userId: user.userId
      }
    })

    logger.info('Reminder created successfully', { reminderId: reminder.id }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: reminder
    })
  }, {
    method: 'POST',
    path: `/api/payments/${params.paymentId}/reminders`,
    userId: undefined,
    requestId
  })
} 