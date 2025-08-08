import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

// Получение конкретного документа для подписи
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    logger.info('Fetching signature document', { userId: user.userId, signatureId: params.id }, user.userId, requestId)

    const signature = await prisma.digitalSignature.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      },
      include: {
        signers: {
          include: {
            client: true
          }
        }
      }
    })

    if (!signature) {
      throw new Error('Документ для подписи не найден')
    }

    return NextResponse.json({
      success: true,
      data: signature
    })

  })
}

// Обновление статуса подписи
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    logger.info('Updating signature document', { userId: user.userId, signatureId: params.id, updateData: body }, user.userId, requestId)

    // Проверяем, что документ существует и принадлежит пользователю
    const existingSignature = await prisma.digitalSignature.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      },
      include: {
        signers: true
      }
    })

    if (!existingSignature) {
      throw new Error('Документ для подписи не найден')
    }

    // Обновляем статус подписи
    const updateData: any = {}

    if (body.status) {
      updateData.status = body.status
    }

    if (body.signedAt) {
      updateData.signedAt = new Date(body.signedAt)
    }

    if (body.signatureData) {
      updateData.signatureData = body.signatureData
    }

    // Если обновляем статус подписанта
    if (body.signerId && body.signerStatus) {
      await prisma.signatureSigner.update({
        where: {
          id: body.signerId,
          signatureId: params.id
        },
        data: {
          status: body.signerStatus,
          signedAt: body.signerStatus === 'signed' ? new Date() : null
        }
      })
    }

    const updatedSignature = await prisma.digitalSignature.update({
      where: {
        id: params.id
      },
      data: updateData,
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
      data: updatedSignature
    })

  })
}

// Удаление документа для подписи
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    logger.info('Deleting signature document', { userId: user.userId, signatureId: params.id }, user.userId, requestId)

    // Проверяем, что документ существует и принадлежит пользователю
    const existingSignature = await prisma.digitalSignature.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!existingSignature) {
      throw new Error('Документ для подписи не найден')
    }

    // Удаляем документ (каскадное удаление подписантов)
    await prisma.digitalSignature.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Документ для подписи успешно удален'
    })

  })
} 