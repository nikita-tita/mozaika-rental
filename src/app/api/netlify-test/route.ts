import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Netlify API работает!',
    timestamp: new Date().toISOString(),
    platform: 'Netlify',
    success: true
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Netlify POST запрос работает!',
    timestamp: new Date().toISOString(),
    platform: 'Netlify',
    success: true
  })
} 