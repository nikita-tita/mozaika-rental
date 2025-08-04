import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'
import { NotificationService } from '@/lib/notifications/service'

// POST /api/notifications/mark-read - Отметить уведомления как прочитанные
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
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAll } = body

    if (markAll) {
      // Отмечаем все уведомления как прочитанные
      await NotificationService.markAllAsRead(user.userId)
      
      return NextResponse.json({
        success: true,
        message: 'Все уведомления отмечены как прочитанные'
      })
    } else if (notificationId) {
      // Отмечаем конкретное уведомление как прочитанное
      await NotificationService.markAsRead(notificationId, user.userId)
      
      return NextResponse.json({
        success: true,
        message: 'Уведомление отмечено как прочитанное'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Укажите notificationId или markAll' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}