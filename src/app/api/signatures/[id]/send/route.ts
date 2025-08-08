import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

// Отправка документа на подпись
export async function POST(
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

    logger.info('Sending document for signature', { userId: user.userId, signatureId: params.id, sendData: body }, user.userId, requestId)

    // Проверяем, что документ существует и принадлежит пользователю
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

    if (signature.status === 'signed') {
      throw new Error('Документ уже подписан')
    }

    // Обновляем статус подписантов на "отправлено"
    const signerUpdates = signature.signers.map(signer => 
      prisma.signatureSigner.update({
        where: { id: signer.id },
        data: { 
          status: 'pending',
          sentAt: new Date()
        }
      })
    )

    await Promise.all(signerUpdates)

    // Обновляем статус документа
    const updatedSignature = await prisma.digitalSignature.update({
      where: {
        id: params.id
      },
      data: {
        status: 'pending',
        sentAt: new Date()
      },
      include: {
        signers: {
          include: {
            client: true
          }
        }
      }
    })

    // Здесь в реальной системе будет отправка уведомлений подписантам
    // Имитация отправки уведомлений
    logger.info('Sending notifications to signers', { 
      signatureId: params.id, 
      signers: signature.signers.map(s => ({ id: s.id, email: s.email, phone: s.phone }))
    }, user.userId, requestId)

    return NextResponse.json({
      success: true,
      data: updatedSignature,
      message: 'Документ отправлен на подпись'
    })

  })
} 