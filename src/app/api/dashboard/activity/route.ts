import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
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

    // Получаем последние действия пользователя
    const recentActivity = []

    // Последние объекты
    const recentProperties = await prisma.property.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    })

    recentProperties.forEach(property => {
      recentActivity.push({
        id: `property-${property.id}`,
        type: 'property',
        title: 'Новый объект добавлен',
        description: property.title,
        timestamp: property.createdAt.toISOString(),
        status: 'success'
      })
    })

    // Последние клиенты
    const recentClients = await prisma.client.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })

    recentClients.forEach(client => {
      recentActivity.push({
        id: `client-${client.id}`,
        type: 'client',
        title: 'Новый клиент добавлен',
        description: `${client.firstName} ${client.lastName}`,
        timestamp: client.createdAt.toISOString(),
        status: 'success'
      })
    })

    // Последние сделки
    const recentDeals = await prisma.deal.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true
      }
    })

    recentDeals.forEach(deal => {
      recentActivity.push({
        id: `deal-${deal.id}`,
        type: 'deal',
        title: 'Новая сделка создана',
        description: `${deal.title} (${deal.status})`,
        timestamp: deal.createdAt.toISOString(),
        status: deal.status === 'COMPLETED' ? 'success' : 'info'
      })
    })

    // Последние платежи
    const recentPayments = await prisma.payment.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true
      }
    })

    recentPayments.forEach(payment => {
      recentActivity.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: payment.status === 'PAID' ? 'Платеж получен' : 'Новый платеж',
        description: `${payment.amount.toLocaleString('ru-RU')} ₽`,
        timestamp: payment.createdAt.toISOString(),
        status: payment.status === 'PAID' ? 'success' : 'warning'
      })
    })

    // Последние договоры
    const recentContracts = await prisma.contract.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true
      }
    })

    recentContracts.forEach(contract => {
      recentActivity.push({
        id: `contract-${contract.id}`,
        type: 'contract',
        title: 'Новый договор создан',
        description: `${contract.title} (${contract.status})`,
        timestamp: contract.createdAt.toISOString(),
        status: contract.status === 'SIGNED' ? 'success' : 'info'
      })
    })

    // Сортируем по времени и берем последние 10
    const sortedActivity = recentActivity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: sortedActivity
    })

  } catch (error) {
    console.error('Error fetching dashboard activity:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 