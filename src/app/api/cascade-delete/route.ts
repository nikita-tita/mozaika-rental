import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { entityType, entityId, action = 'archive' } = body

    if (!entityType || !entityId) {
      return NextResponse.json(
        { success: false, error: 'Необходимо указать тип и ID сущности' },
        { status: 400 }
      )
    }

    let result = null

    switch (entityType) {
      case 'property':
        result = await handlePropertyDeletion(entityId, user.userId, action)
        break
      case 'client':
        result = await handleClientDeletion(entityId, user.userId, action)
        break
      case 'deal':
        result = await handleDealDeletion(entityId, user.userId, action)
        break
      case 'contract':
        result = await handleContractDeletion(entityId, user.userId, action)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Неизвестный тип сущности' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Сущность ${action === 'delete' ? 'удалена' : 'архивирована'} успешно`
    })

  } catch (error) {
    console.error('Error in cascade delete:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

async function handlePropertyDeletion(propertyId: string, userId: string, action: string) {
  // Проверяем связанные сделки
  const relatedDeals = await prisma.deal.findMany({
    where: {
      propertyId: propertyId,
      userId: userId
    },
    include: {
      contracts: true,
      payments: true
    }
  })

  if (relatedDeals.length > 0) {
    // Если есть связанные сделки, предлагаем их также удалить/архивировать
    const dealIds = relatedDeals.map(deal => deal.id)
    const contractIds = relatedDeals.flatMap(deal => deal.contracts.map(contract => contract.id))
    const paymentIds = relatedDeals.flatMap(deal => deal.payments.map(payment => payment.id))

    if (action === 'delete') {
      // Удаляем все связанные сущности
      await prisma.payment.deleteMany({
        where: { id: { in: paymentIds } }
      })

      await prisma.contract.deleteMany({
        where: { id: { in: contractIds } }
      })

      await prisma.deal.deleteMany({
        where: { id: { in: dealIds } }
      })
    } else {
      // Архивируем связанные сущности
      await prisma.payment.updateMany({
        where: { id: { in: paymentIds } },
        data: { status: 'CANCELLED' }
      })

      await prisma.contract.updateMany({
        where: { id: { in: contractIds } },
        data: { status: 'TERMINATED' }
      })

      await prisma.deal.updateMany({
        where: { id: { in: dealIds } },
        data: { status: 'CANCELLED' }
      })
    }
  }

  // Удаляем/архивируем объект недвижимости
  if (action === 'delete') {
    return await prisma.property.delete({
      where: { id: propertyId, userId: userId }
    })
  } else {
    return await prisma.property.update({
      where: { id: propertyId, userId: userId },
      data: { status: 'MAINTENANCE' } // Архивируем как "на обслуживании"
    })
  }
}

async function handleClientDeletion(clientId: string, userId: string, action: string) {
  // Проверяем связанные сделки
  const relatedDeals = await prisma.deal.findMany({
    where: {
      OR: [
        { tenantId: clientId },
        { landlordId: clientId },
        { clientId: clientId }
      ],
      userId: userId
    },
    include: {
      contracts: true,
      payments: true
    }
  })

  if (relatedDeals.length > 0) {
    const dealIds = relatedDeals.map(deal => deal.id)
    const contractIds = relatedDeals.flatMap(deal => deal.contracts.map(contract => contract.id))
    const paymentIds = relatedDeals.flatMap(deal => deal.payments.map(payment => payment.id))

    if (action === 'delete') {
      await prisma.payment.deleteMany({
        where: { id: { in: paymentIds } }
      })

      await prisma.contract.deleteMany({
        where: { id: { in: contractIds } }
      })

      await prisma.deal.deleteMany({
        where: { id: { in: dealIds } }
      })
    } else {
      await prisma.payment.updateMany({
        where: { id: { in: paymentIds } },
        data: { status: 'CANCELLED' }
      })

      await prisma.contract.updateMany({
        where: { id: { in: contractIds } },
        data: { status: 'TERMINATED' }
      })

      await prisma.deal.updateMany({
        where: { id: { in: dealIds } },
        data: { status: 'CANCELLED' }
      })
    }
  }

  // Удаляем/архивируем клиента
  if (action === 'delete') {
    return await prisma.client.delete({
      where: { id: clientId, userId: userId }
    })
  } else {
    return await prisma.client.update({
      where: { id: clientId, userId: userId },
      data: { isActive: false }
    })
  }
}

async function handleDealDeletion(dealId: string, userId: string, action: string) {
  // Проверяем связанные договоры и платежи
  const relatedContracts = await prisma.contract.findMany({
    where: { dealId: dealId, userId: userId }
  })

  const relatedPayments = await prisma.payment.findMany({
    where: { dealId: dealId, userId: userId }
  })

  const contractIds = relatedContracts.map(contract => contract.id)
  const paymentIds = relatedPayments.map(payment => payment.id)

  if (action === 'delete') {
    await prisma.payment.deleteMany({
      where: { id: { in: paymentIds } }
    })

    await prisma.contract.deleteMany({
      where: { id: { in: contractIds } }
    })
  } else {
    await prisma.payment.updateMany({
      where: { id: { in: paymentIds } },
      data: { status: 'CANCELLED' }
    })

    await prisma.contract.updateMany({
      where: { id: { in: contractIds } },
      data: { status: 'TERMINATED' }
    })
  }

  // Удаляем/архивируем сделку
  if (action === 'delete') {
    return await prisma.deal.delete({
      where: { id: dealId, userId: userId }
    })
  } else {
    return await prisma.deal.update({
      where: { id: dealId, userId: userId },
      data: { status: 'CANCELLED' }
    })
  }
}

async function handleContractDeletion(contractId: string, userId: string, action: string) {
  // Проверяем связанные платежи
  const relatedPayments = await prisma.payment.findMany({
    where: { contractId: contractId, userId: userId }
  })

  const paymentIds = relatedPayments.map(payment => payment.id)

  if (action === 'delete') {
    await prisma.payment.deleteMany({
      where: { id: { in: paymentIds } }
    })
  } else {
    await prisma.payment.updateMany({
      where: { id: { in: paymentIds } },
      data: { status: 'CANCELLED' }
    })
  }

  // Удаляем/архивируем договор
  if (action === 'delete') {
    return await prisma.contract.delete({
      where: { id: contractId, userId: userId }
    })
  } else {
    return await prisma.contract.update({
      where: { id: contractId, userId: userId },
      data: { status: 'TERMINATED' }
    })
  }
} 