import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Тест переменных окружения',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasLogLevel: !!process.env.LOG_LEVEL,
    vercelUrl: process.env.VERCEL_URL,
    vercelEnv: process.env.VERCEL_ENV
  })
} 