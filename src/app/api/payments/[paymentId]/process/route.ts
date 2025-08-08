import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
    const body = await request.json()

    logger.info('Processing payment', { 
      paymentId: params.paymentId, 
      method: body.method 
    }, undefined, requestId)

    // Получаем информацию о платеже
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: {
        property: {
          select: {
            title: true
          }
        },
        deal: {
          select: {
            tenant: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!payment) {
      throw new Error(`Payment not found: ${params.paymentId}`)
    }

    // Проверяем, что платеж еще не оплачен
    if (payment.status === 'PAID') {
      throw new Error('Payment already processed')
    }

    // Проверяем, что у платежа есть ссылка для оплаты
    if (!payment.paymentLink) {
      throw new Error('Payment link not available')
    }

    // Имитация обработки платежа
    // В реальном проекте здесь была бы интеграция с платежными системами
    let paymentSuccess = false
    let errorMessage = ''

    try {
      // Имитация проверки карты
      if (body.method === 'card') {
        const { cardData } = body
        
        // Простая валидация
        if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.holder) {
          throw new Error('Не все поля карты заполнены')
        }

        if (cardData.number.length < 13 || cardData.number.length > 19) {
          throw new Error('Неверный номер карты')
        }

        if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
          throw new Error('Неверный формат срока действия')
        }

        if (!/^\d{3,4}$/.test(cardData.cvv)) {
          throw new Error('Неверный CVV код')
        }

        // Имитация успешной оплаты (90% успеха)
        paymentSuccess = Math.random() > 0.1
        if (!paymentSuccess) {
          errorMessage = 'Недостаточно средств на карте'
        }
      } else if (body.method === 'bank') {
        // Для банковского перевода всегда успех
        paymentSuccess = true
      }
    } catch (error) {
      paymentSuccess = false
      errorMessage = error instanceof Error ? error.message : 'Ошибка обработки платежа'
    }

    if (paymentSuccess) {
      // Обновляем статус платежа
      await prisma.payment.update({
        where: { id: params.paymentId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          notes: `Оплачено через ${body.method === 'card' ? 'банковскую карту' : 'банковский перевод'}`
        }
      })

      // Создаем уведомление для агента
      await prisma.notification.create({
        data: {
          title: 'Платеж оплачен',
          message: `Платеж на сумму ${payment.amount.toLocaleString()} ₽ по объекту "${payment.property?.title}" был успешно оплачен`,
          type: 'SUCCESS',
          userId: payment.userId
        }
      })

      logger.info('Payment processed successfully', { 
        paymentId: params.paymentId,
        method: body.method,
        amount: payment.amount
      }, undefined, requestId)

      return NextResponse.json({
        success: true,
        data: {
          paymentId: params.paymentId,
          status: 'PAID',
          amount: payment.amount,
          paidAt: new Date()
        }
      })
    } else {
      logger.error('Payment processing failed', { 
        paymentId: params.paymentId,
        method: body.method,
        error: errorMessage
      }, undefined, requestId)

      return NextResponse.json({
        success: false,
        error: errorMessage || 'Ошибка обработки платежа'
      })
    }
  }, {
    method: 'POST',
    path: `/api/payments/${params.paymentId}/process`,
    userId: undefined,
    requestId
  })
} 