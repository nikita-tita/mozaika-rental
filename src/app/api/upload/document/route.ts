import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { verifyJWTToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const user = verifyJWTToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Файл не найден' },
        { status: 400 }
      )
    }

    // Проверяем тип файла - только документы
    const allowedDocumentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!allowedDocumentTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Недопустимый тип файла. Разрешены: PDF, DOC, DOCX, XLS, XLSX' },
        { status: 400 }
      )
    }

    // Проверяем размер файла (50MB для документов)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Файл слишком большой. Максимальный размер: 50MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `doc_${timestamp}-${random}.${extension}`

    // Создаем папку для документов, если её нет
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents')
    const filePath = join(uploadDir, filename)
    
    try {
      await writeFile(filePath, buffer)
    } catch (error) {
      // Если папка не существует, создаем её
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
        await writeFile(filePath, buffer)
      } else {
        throw error
      }
    }

    const fileUrl = `/uploads/documents/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      message: 'Документ успешно загружен'
    })

  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке документа' },
      { status: 500 }
    )
  }
} 