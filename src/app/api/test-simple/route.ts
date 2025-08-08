import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Простой API работает!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'POST запрос работает!',
    timestamp: new Date().toISOString()
  })
} 