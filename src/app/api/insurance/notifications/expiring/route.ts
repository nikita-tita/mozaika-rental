import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'

// GET /api/insurance/notifications/expiring - получить уведомления об истекающих полисах
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем полисы, которые истекают в течение 30 дней
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringPolicies = await prisma.insurancePolicy.findMany({
      where: {
        userId: user.userId,
        status: 'ACTIVE',
        endDate: {
          lte: thirtyDaysFromNow,
          gte: new Date()
        }
      },
      include: {
        property: true
      },
      orderBy: {
        endDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      expiringPolicies,
      count: expiringPolicies.length
    })
  } catch (error) {
    console.error('Error fetching expiring policies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/insurance/notifications/expiring - создать уведомления об истечении
export async function POST(request: NextRequest) {
  try {
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем полисы, которые истекают в течение следующих 30 дней
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringPolicies = await prisma.insurancePolicy.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        endDate: {
          lte: thirtyDaysFromNow,
          gt: new Date()
        }
      }
    })

    // Создаем уведомления для каждого истекающего полиса
    const notifications = []
    for (const policy of expiringPolicies) {
      const daysUntilExpiry = Math.ceil(
        (new Date(policy.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )

      // Проверяем, не создано ли уже уведомление для этого полиса
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: user.id,
          policyId: policy.id,
          title: {
            contains: 'истекает'
          },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // За последние 24 часа
          }
        }
      })

      if (!existingNotification) {
        const notification = await prisma.notification.create({
          data: {
            title: 'Полис страхования истекает',
            message: `Полис ${policy.policyNumber} истекает через ${daysUntilExpiry} дней. Рекомендуем продлить страхование.`,
            type: 'WARNING',
            userId: user.id,
            policyId: policy.id
          }
        })
        notifications.push(notification)
      }
    }

    return NextResponse.json({
      message: `Создано ${notifications.length} уведомлений`,
      notifications
    })
  } catch (error) {
    console.error('Error creating expiring notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 