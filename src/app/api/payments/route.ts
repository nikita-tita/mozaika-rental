import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
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

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const dealId = searchParams.get('dealId')
    const contractId = searchParams.get('contractId')

    logger.info('Fetching payments for user', { userId: user.userId, propertyId, dealId, contractId }, user.userId, requestId)

    // Формируем условия поиска
    const where: any = {
      userId: user.userId
    }

    if (propertyId) {
      where.propertyId = propertyId
    }

    if (dealId) {
      where.dealId = dealId
    }

    if (contractId) {
      where.contractId = contractId
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true
          }
        },
        deal: {
          select: {
            id: true,
            title: true,
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        contract: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    logger.info('Payments fetched successfully', { count: payments.length }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: payments
    })
  }, {
    method: 'GET',
    path: '/api/payments',
    userId: undefined,
    requestId
  })
}

export async function POST(request: NextRequest) {
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

    logger.info('Creating payment for user', { userId: user.userId, paymentData: body }, user.userId, requestId)

    // Проверяем, что объект недвижимости существует и принадлежит пользователю
    if (body.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: body.propertyId }
      })

      if (!property) {
        throw new Error(`Property not found: ${body.propertyId}`)
      }

      if (property.userId !== user.userId) {
        throw new Error(`Property access denied: ${body.propertyId} for user ${user.userId}`)
      }
    }

    // Проверяем, что сделка существует и принадлежит пользователю
    if (body.dealId) {
      const deal = await prisma.deal.findUnique({
        where: { id: body.dealId }
      })

      if (!deal) {
        throw new Error(`Deal not found: ${body.dealId}`)
      }

      if (deal.userId !== user.userId) {
        throw new Error(`Deal access denied: ${body.dealId} for user ${user.userId}`)
      }
    }

    // Проверяем, что договор существует и принадлежит пользователю
    if (body.contractId) {
      const contract = await prisma.contract.findUnique({
        where: { id: body.contractId }
      })

      if (!contract) {
        throw new Error(`Contract not found: ${body.contractId}`)
      }

      if (contract.userId !== user.userId) {
        throw new Error(`Contract access denied: ${body.contractId} for user ${user.userId}`)
      }
    }

    // Создаем платеж
    const payment = await prisma.payment.create({
      data: {
        type: body.type || 'RENT',
        amount: body.amount || 0,
        status: body.status || 'PENDING',
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(),
        description: body.description || '',
        property: body.propertyId ? {
          connect: { id: body.propertyId }
        } : undefined,
        deal: body.dealId ? {
          connect: { id: body.dealId }
        } : undefined,
        contract: body.contractId ? {
          connect: { id: body.contractId }
        } : undefined,
        user: {
          connect: { id: user.userId }
        }
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true
          }
        },
        deal: {
          select: {
            id: true,
            title: true,
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        contract: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    logger.info('Payment created successfully', { paymentId: payment.id }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: payment
    })
  }, {
    method: 'POST',
    path: '/api/payments',
    userId: undefined,
    requestId
  })
}