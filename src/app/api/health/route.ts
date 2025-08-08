import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API работает!'
  })
} // Проверка деплоя Wed Aug  6 12:01:36 MSK 2025
