import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({
      success: false,
      message: 'Токен не найден'
    })
  }

  try {
    const decoded = verifyJWTToken(token)
    
    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Токен недействителен',
        token: token.substring(0, 50) + '...'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Токен действителен',
      decoded,
      token: token.substring(0, 50) + '...'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Ошибка проверки токена',
      error: error.message,
      token: token.substring(0, 50) + '...'
    })
  }
} 