import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

// Получение списка документов для подписи
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      throw new Error('Unauthorized: No token provided')
    }

    const user = verifyJWTToken(token)
    if (!user) {
      throw new Error('Unauthorized: Invalid token')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    logger.info('Fetching signatures for user', { userId: user.userId, status, type }, user.userId, requestId)

    // Формируем условия поиска
    const where: any = {
      userId: user.userId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.documentType = type
    }

    const signatures = await prisma.digitalSignature.findMany({
      where,
      include: {
        signers: {
          include: {
            client: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: signatures
    })

  })
}

// Создание нового документа для подписи
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  
  return ApiErrorHandler.withErrorHandling(async () => {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      throw new Error('Unauthorized: No token provided')
    }

    const user = verifyJWTToken(token)
    if (!user) {
      throw new Error('Unauthorized: Invalid token')
    }

    const body = await request.json()

    logger.info('Creating signature document for user', { userId: user.userId, documentData: body }, user.userId, requestId)

    // Валидация обязательных полей
    if (!body.documentType?.trim()) {
      throw new Error('Тип документа обязателен')
    }

    if (!body.documentUrl?.trim()) {
      throw new Error('URL документа обязателен')
    }

    if (!body.signers || body.signers.length === 0) {
      throw new Error('Необходимо указать хотя бы одного подписанта')
    }

    // Создаем документ для подписи
    const signature = await prisma.digitalSignature.create({
      data: {
        documentType: body.documentType,
        documentId: body.documentId || null,
        documentUrl: body.documentUrl,
        status: 'pending',
        contractId: body.contractId || null,
        createdBy: user.userId,
        userId: user.userId,
        signers: {
          create: body.signers.map((signer: any) => ({
            clientId: signer.clientId,
            role: signer.role,
            status: 'pending',
            email: signer.email,
            phone: signer.phone
          }))
        }
      },
      include: {
        signers: {
          include: {
            client: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: signature
    })

  })
} 