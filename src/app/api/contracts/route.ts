import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const contracts = await prisma.contract.findMany({
      where: {
        userId: user.userId,
        status: 'SIGNED'
      },
      include: {
        deal: {
          include: {
            property: true,
            tenant: true,
            landlord: true,
            client: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: contracts
    })

  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
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

    logger.info('Creating contract for user', { userId: user.userId, contractData: body }, user.userId, requestId)

    // Валидация обязательных полей
    if (!body.title?.trim()) {
      throw new Error('Название договора обязательно')
    }

    if (!body.dealId) {
      throw new Error('Сделка обязательна')
    }

    if (!body.content?.trim()) {
      throw new Error('Содержание договора обязательно')
    }

    // Проверяем, что сделка существует и принадлежит пользователю
    const deal = await prisma.deal.findUnique({
      where: { id: body.dealId },
      include: {
        property: true,
        tenant: true,
        landlord: true
      }
    })

    if (!deal) {
      throw new Error(`Сделка не найдена: ${body.dealId}`)
    }

    if (deal.userId !== user.userId) {
      throw new Error(`Доступ к сделке запрещен: ${body.dealId}`)
    }

    // Проверяем, что сделка в подходящем статусе для создания договора
    if (!['IN_PROGRESS', 'COMPLETED'].includes(deal.status)) {
      throw new Error('Договор можно создать только для сделок в статусе "В работе" или "Завершена"')
    }

    // Создаем договор
    const contract = await prisma.contract.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        status: 'DRAFT', // Начинаем с черновика
        deal: {
          connect: { id: body.dealId }
        },
        user: {
          connect: { id: user.userId }
        }
      },
      include: {
        deal: {
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
        }
      }
    })

    logger.info('Contract created successfully', { contractId: contract.id }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      message: 'Договор успешно создан',
      data: contract
    })
  }, {
    method: 'POST',
    path: '/api/contracts',
    userId: undefined,
    requestId
  })
}