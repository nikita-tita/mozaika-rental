import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API корневой endpoint работает!',
    timestamp: new Date().toISOString()
  })
} 