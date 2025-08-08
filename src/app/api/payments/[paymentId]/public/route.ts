import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
    logger.info('Fetching public payment info', { paymentId: params.paymentId }, undefined, requestId)

    // Получаем информацию о платеже (публичный доступ)
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: {
        property: {
          select: {
            title: true,
            address: true
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

    // Проверяем, что у платежа есть ссылка для оплаты
    if (!payment.paymentLink) {
      throw new Error('Payment link not available')
    }

    logger.info('Public payment info fetched successfully', { paymentId: params.paymentId }, undefined, requestId)

    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        amount: payment.amount,
        description: payment.description,
        dueDate: payment.dueDate,
        status: payment.status,
        property: payment.property,
        deal: payment.deal
      }
    })
  }, {
    method: 'GET',
    path: `/api/payments/${params.paymentId}/public`,
    userId: undefined,
    requestId
  })
} 