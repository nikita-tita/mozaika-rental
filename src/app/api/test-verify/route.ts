import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.json({ error: 'Токен не найден' })
  }
  
  try {
    const user = verifyJWTToken(token)
    return NextResponse.json({
      success: true,
      user,
      tokenPreview: token.substring(0, 50) + '...',
      tokenLength: token.length
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      tokenPreview: token.substring(0, 50) + '...',
      tokenLength: token.length
    })
  }
} 