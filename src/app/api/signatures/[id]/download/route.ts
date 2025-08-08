import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { ApiErrorHandler, generateRequestId } from '@/lib/api-error-handler'
import { logger } from '@/lib/logger'

// Скачивание подписанного документа
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

    logger.info('Downloading signed document', { userId: user.userId, signatureId: params.id }, user.userId, requestId)

    // Получаем документ для подписи
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

    // Проверяем, что документ подписан
    if (signature.status !== 'signed') {
      throw new Error('Документ еще не подписан')
    }

    // В реальной системе здесь будет генерация PDF с подписями
    // Для демо-версии возвращаем информацию о документе
    const documentInfo = {
      id: signature.id,
      documentType: signature.documentType,
      documentUrl: signature.documentUrl,
      status: signature.status,
      signedAt: signature.signedAt,
      signers: signature.signers.map(signer => ({
        name: signer.client ? `${signer.client.firstName} ${signer.client.lastName}` : 'Неизвестно',
        role: signer.role,
        status: signer.status,
        signedAt: signer.signedAt
      })),
      downloadUrl: signature.documentUrl, // В реальной системе это будет URL к подписанному PDF
      fileName: `${signature.documentType}_подписанный_${new Date(signature.signedAt || Date.now()).toISOString().split('T')[0]}.pdf`
    }

    return NextResponse.json({
      success: true,
      data: documentInfo,
      message: 'Документ готов для скачивания'
    })

  })
}

// Генерация подписанного PDF (в реальной системе)
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

    logger.info('Generating signed PDF', { userId: user.userId, signatureId: params.id }, user.userId, requestId)

    // Получаем документ для подписи
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

    // Проверяем, что все подписанты подписали документ
    const allSigned = signature.signers.every(signer => signer.status === 'signed')
    if (!allSigned) {
      throw new Error('Не все подписанты подписали документ')
    }

    // В реальной системе здесь будет генерация PDF с подписями
    // Для демо-версии имитируем процесс
    const generatedPdfUrl = `/api/signatures/${params.id}/document.pdf`
    
    // Обновляем статус документа
    await prisma.digitalSignature.update({
      where: {
        id: params.id
      },
      data: {
        status: 'signed',
        signedAt: new Date(),
        documentUrl: generatedPdfUrl
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: generatedPdfUrl,
        fileName: `${signature.documentType}_подписанный_${new Date().toISOString().split('T')[0]}.pdf`
      },
      message: 'Подписанный PDF сгенерирован'
    })

  })
} 