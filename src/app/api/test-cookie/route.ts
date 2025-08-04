import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const allCookies = request.cookies.getAll()
  
  return NextResponse.json({
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 50) + '...' : 'нет',
    allCookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
    headers: {
      cookie: request.headers.get('cookie'),
      host: request.headers.get('host'),
      userAgent: request.headers.get('user-agent')?.substring(0, 50)
    }
  })
} 