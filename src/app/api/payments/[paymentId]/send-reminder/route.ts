import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'
import { NotificationService } from '@/lib/services/notification-service'

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

    logger.info('Sending reminder for payment', { 
      paymentId: params.paymentId, 
      type: body.type 
    }, user.userId, requestId)

    // Получаем информацию о платеже
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: {
        deal: {
          select: {
            tenant: {
              select: {
                firstName: true,
                lastName: true,
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

    // Определяем адрес получателя
    let recipientAddress = ''
    if (body.type === 'EMAIL') {
      recipientAddress = payment.deal?.tenant?.email || ''
      if (!recipientAddress) {
        throw new Error('Tenant email not found for email reminder')
      }
    } else if (body.type === 'SMS' || body.type === 'WHATSAPP') {
      recipientAddress = payment.deal?.tenant?.phone || ''
      if (!recipientAddress) {
        throw new Error('Tenant phone not found for SMS/WhatsApp reminder')
      }
    }

    try {
      // Отправляем уведомление
      await NotificationService.sendNotification({
        type: body.type,
        to: recipientAddress,
        subject: body.type === 'EMAIL' ? 'Напоминание об оплате аренды' : undefined,
        message: body.message,
        paymentId: params.paymentId
      })

      // Обновляем статус напоминания
      const reminder = await prisma.paymentReminder.update({
        where: { id: body.reminderId },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      })

      // Обновляем информацию о платеже
      await prisma.payment.update({
        where: { id: params.paymentId },
        data: {
          reminderSentAt: new Date(),
          reminderCount: {
            increment: 1
          },
          lastReminderType: body.type
        }
      })

      logger.info('Reminder sent successfully', { 
        paymentId: params.paymentId,
        type: body.type,
        reminderId: reminder.id
      }, user.userId, requestId)

      return NextResponse.json({
        success: true,
        data: reminder
      })
    } catch (error) {
      // Обновляем статус напоминания на FAILED
      await prisma.paymentReminder.update({
        where: { id: body.reminderId },
        data: {
          status: 'FAILED'
        }
      })

      logger.error('Failed to send reminder', { 
        paymentId: params.paymentId,
        type: body.type,
        error
      }, user.userId, requestId)

      throw error
    }
  }, {
    method: 'POST',
    path: `/api/payments/${params.paymentId}/send-reminder`,
    userId: undefined,
    requestId
  })
} 