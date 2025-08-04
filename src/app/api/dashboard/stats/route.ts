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

    // Получаем статистику для пользователя
    const [
      propertiesCount,
      clientsCount,
      dealsCount,
      contractsCount,
      paymentsCount,
      notificationsCount,
      totalRevenue,
      pendingPayments
    ] = await Promise.all([
      // Количество объектов
      prisma.property.count({
        where: { userId: user.userId }
      }),
      
      // Количество клиентов
      prisma.client.count({
        where: { userId: user.userId }
      }),
      
      // Количество сделок
      prisma.deal.count({
        where: { userId: user.userId }
      }),
      
      // Количество договоров
      prisma.contract.count({
        where: { userId: user.userId }
      }),
      
      // Количество платежей
      prisma.payment.count({
        where: { userId: user.userId }
      }),
      
      // Количество уведомлений
      prisma.notification.count({
        where: { userId: user.userId }
      }),
      
      // Общий доход (сумма всех оплаченных платежей)
      prisma.payment.aggregate({
        where: {
          userId: user.userId,
          status: 'PAID'
        },
        _sum: {
          amount: true
        }
      }),
      
      // Ожидающие платежи
      prisma.payment.aggregate({
        where: {
          userId: user.userId,
          status: 'PENDING'
        },
        _sum: {
          amount: true
        }
      })
    ])

    const stats = {
      properties: propertiesCount,
      clients: clientsCount,
      deals: dealsCount,
      contracts: contractsCount,
      payments: paymentsCount,
      notifications: notificationsCount,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingPayments: pendingPayments._sum.amount || 0
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 