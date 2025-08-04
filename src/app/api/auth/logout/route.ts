import { NextRequest, NextResponse } from 'next/server'
import { logoutUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      await logoutUser(token)
    }

    // Создаем ответ и удаляем cookie
    const response = NextResponse.json({
      success: true,
      message: 'Успешный выход'
    })

    // Удаляем cookie с правильными параметрами
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })
    
    // Также удаляем через delete для надежности
    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Ошибка выхода:', error)
    return NextResponse.json({
      success: false,
      message: 'Ошибка при выходе'
    }, { status: 500 })
  }
}