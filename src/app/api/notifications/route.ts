import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'
import { NotificationService } from '@/lib/notifications/service'

// GET /api/notifications - Получить уведомления пользователя
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const result = await NotificationService.getUserNotifications(user.userId, {
      page,
      limit,
      unreadOnly
    })

    return NextResponse.json({
      success: true,
      data: result.notifications,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasMore: result.hasMore
      }
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Создать уведомление (для админов или системы)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Недостаточно прав доступа' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      type, 
      channel, 
      priority = 'normal', 
      recipientId, 
      title, 
      message, 
      data, 
      scheduledAt, 
      expiresAt 
    } = body

    if (!type || !recipientId || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Обязательные поля: type, recipientId, title, message' },
        { status: 400 }
      )
    }

    const notificationId = await NotificationService.createNotification({
      type,
      channel: channel || ['in_app'],
      priority,
      recipientId,
      title,
      message,
      data,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    })

    return NextResponse.json({
      success: true,
      data: { id: notificationId },
      message: 'Уведомление создано'
    })

  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}