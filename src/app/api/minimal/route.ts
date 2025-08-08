import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Минимальный API работает!',
    timestamp: new Date().toISOString(),
    success: true
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'POST запрос работает!',
    timestamp: new Date().toISOString(),
    success: true
  })
} 