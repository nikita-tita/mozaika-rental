import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Токен не найден'
      }, { status: 401 })
    }

    const user = await getCurrentUser(token)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Недействительный токен'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Ошибка получения пользователя:', error)
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
} 