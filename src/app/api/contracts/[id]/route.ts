import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface RouteContext {
  params: { id: string }
}

// GET /api/contracts/[id] - Получить конкретный договор
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

    const contractId = params.id

    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        OR: [
          { tenantId: user.userId },
          { property: { ownerId: user.userId } }
        ]
      },
      include: {
        property: {
          include: {
            images: {
              orderBy: { order: 'asc' }
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true
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
            phone: true,
            avatar: true
          }
        },
        booking: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            message: true
          }
        }
      }
    })

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Договор не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contract
    })

  } catch (error) {
    console.error('Contract fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// PATCH /api/contracts/[id] - Обновить договор
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

    const contractId = params.id
    const body = await request.json()
    const { status, terms, monthlyRent, deposit } = body

    // Проверяем существование договора и права доступа
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        OR: [
          { tenantId: user.userId },
          { property: { ownerId: user.userId } }
        ]
      },
      include: {
        property: true,
        tenant: true
      }
    })

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Договор не найден' },
        { status: 404 }
      )
    }

    const isLandlord = contract.property.ownerId === user.userId
    const isTenant = contract.tenantId === user.userId

    // Определяем, какие поля можно обновлять
    const updateData: any = {}

    // Статус может изменять арендодатель и арендатор (подписание)
    if (status) {
      const allowedTransitions: Record<string, string[]> = {
        DRAFT: isLandlord ? ['ACTIVE'] : ['ACTIVE'], // Оба могут подписать
        ACTIVE: isLandlord ? ['TERMINATED', 'EXPIRED'] : ['TERMINATED'],
        EXPIRED: [],
        TERMINATED: []
      }

      const currentStatus = contract.status
      const allowedStatuses = allowedTransitions[currentStatus] || []

      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Недопустимое изменение статуса' },
          { status: 400 }
        )
      }

      updateData.status = status

      // При подписании (активации) устанавливаем дату подписания
      if (status === 'ACTIVE' && !contract.signedAt) {
        updateData.signedAt = new Date()
      }
    }

    // Условия может изменять только арендодатель и только в статусе DRAFT
    if (terms && isLandlord && contract.status === 'DRAFT') {
      updateData.terms = terms
    }

    // Финансовые условия может изменять только арендодатель и только в статусе DRAFT
    if (isLandlord && contract.status === 'DRAFT') {
      if (monthlyRent !== undefined) {
        updateData.monthlyRent = parseFloat(monthlyRent)
      }
      if (deposit !== undefined) {
        updateData.deposit = parseFloat(deposit)
      }
    }

    // Если нет изменений для обновления
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Нет данных для обновления или недостаточно прав' },
        { status: 400 }
      )
    }

    // Обновляем договор
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
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
        booking: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedContract,
      message: 'Договор обновлен'
    })

  } catch (error) {
    console.error('Contract update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/contracts/[id] - Удалить договор (только черновики)
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

    const contractId = params.id

    // Проверяем договор и права доступа
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        property: { ownerId: user.userId }, // Только арендодатель может удалять
        status: 'DRAFT' // Только черновики
      }
    })

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Договор не найден или его нельзя удалить' },
        { status: 404 }
      )
    }

    await prisma.contract.delete({
      where: { id: contractId }
    })

    return NextResponse.json({
      success: true,
      message: 'Договор удален'
    })

  } catch (error) {
    console.error('Contract deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}