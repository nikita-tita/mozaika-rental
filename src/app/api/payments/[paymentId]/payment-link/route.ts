import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'
import QRCode from 'qrcode'

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

    logger.info('Generating payment link for payment', { 
      paymentId: params.paymentId, 
      amount: body.amount 
    }, user.userId, requestId)

    // Проверяем, что платеж существует и принадлежит пользователю
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

    if (payment.userId !== user.userId) {
      throw new Error(`Payment access denied: ${params.paymentId} for user ${user.userId}`)
    }

    // Генерируем уникальную ссылку для оплаты
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const paymentLink = `${baseUrl}/payment/${params.paymentId}?amount=${body.amount}&description=${encodeURIComponent(body.description)}`

    // Генерируем QR-код
    let qrCodeDataUrl = ''
    try {
      qrCodeDataUrl = await QRCode.toDataURL(paymentLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      logger.error('Error generating QR code', { error }, user.userId, requestId)
    }

    // Сохраняем информацию о ссылке в базе данных
    await prisma.payment.update({
      where: { id: params.paymentId },
      data: {
        paymentLink: paymentLink,
        paymentLinkGeneratedAt: new Date()
      }
    })

    logger.info('Payment link generated successfully', { 
      paymentId: params.paymentId,
      paymentLink 
    }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: {
        paymentLink,
        qrCode: qrCodeDataUrl,
        paymentId: params.paymentId,
        amount: body.amount,
        description: body.description,
        propertyTitle: payment.property?.title,
        tenantName: payment.deal?.tenant ? 
          `${payment.deal.tenant.firstName} ${payment.deal.tenant.lastName}` : 
          'Не указан'
      }
    })
  }, {
    method: 'POST',
    path: `/api/payments/${params.paymentId}/payment-link`,
    userId: undefined,
    requestId
  })
} 