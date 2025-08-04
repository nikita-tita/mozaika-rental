import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Токен не предоставлен'
      })
    }

    const decoded = verifyJWTToken(token)
    
    return NextResponse.json({
      success: true,
      isValid: !!decoded,
      decoded: decoded,
      token: token.substring(0, 50) + '...'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Ошибка проверки токена',
      error: error.message
    })
  }
} 