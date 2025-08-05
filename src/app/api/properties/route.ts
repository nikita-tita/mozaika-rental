import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWTToken } from '@/lib/auth'
import { CreatePropertySchema } from '@/lib/validations'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
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

    const properties = await prisma.property.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: properties
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization или cookie
    const authHeader = request.headers.get('authorization')
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
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

    // Проверяем, что пользователь существует в базе данных
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Проверяем Content-Type для определения типа данных
    const contentType = request.headers.get('content-type') || ''
    
    let formData: any = {}
    let images: File[] = []
    
    if (contentType.includes('multipart/form-data')) {
      // Обрабатываем FormData
      const formDataObj = await request.formData()
      
      // Извлекаем данные формы
      for (const [key, value] of formDataObj.entries()) {
        if (key.startsWith('images[')) {
          if (value instanceof File) {
            images.push(value)
          }
        } else if (key === 'features') {
          try {
            formData[key] = JSON.parse(value as string)
          } catch {
            formData[key] = []
          }
        } else {
          formData[key] = value
        }
      }
    } else {
      // Обрабатываем JSON
      formData = await request.json()
    }

    console.log('Полученные данные формы:', formData)
    
    try {
      const validationResult = CreatePropertySchema.safeParse(formData)

      if (!validationResult.success) {
        console.log('Ошибки валидации:', validationResult.error)
        const errors = validationResult.error.errors?.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Неизвестная ошибка валидации'
        console.error('Детали ошибки валидации:', {
          errors: validationResult.error.errors,
          formData: formData
        })
        return NextResponse.json(
          { success: false, error: `Ошибка валидации: ${errors}` },
          { status: 400 }
        )
      }

      const validatedData = validationResult.data
      console.log('Валидированные данные:', validatedData)

      // Создаем объект недвижимости
      const property = await prisma.property.create({
        data: {
          title: validatedData.title,
          description: validatedData.description || '',
          type: validatedData.type,
          address: validatedData.address,
          price: validatedData.price || validatedData.pricePerMonth || 0, // Используем price или pricePerMonth
          bedrooms: validatedData.bedrooms || null,
          bathrooms: validatedData.bathrooms || null,
          area: validatedData.area || null,
          features: validatedData.features || [],
          images: [], // Пока оставляем пустым, добавим после обработки изображений
          user: {
            connect: {
              id: existingUser.id
            }
          }
        }
      })

      console.log('Объект создан:', property)

      // Обрабатываем загрузку изображений
      const imageUrls: string[] = []
      if (images.length > 0) {
        // Создаем директорию для загрузок, если её нет
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true })
        }

        const imagePromises = images.map(async (image, index) => {
          try {
            // Проверяем тип файла
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!allowedTypes.includes(image.type)) {
              throw new Error(`Недопустимый тип файла: ${image.type}`)
            }

            // Проверяем размер файла (10MB)
            const maxSize = 10 * 1024 * 1024 // 10MB
            if (image.size > maxSize) {
              throw new Error('Файл слишком большой. Максимальный размер: 10MB')
            }

            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Генерируем уникальное имя файла
            const timestamp = Date.now()
            const random = Math.random().toString(36).substring(2, 15)
            const extension = image.name.split('.').pop()
            const filename = `${timestamp}-${random}.${extension}`

            // Сохраняем файл
            const filePath = join(uploadDir, filename)
            await writeFile(filePath, buffer)

            const fileUrl = `/uploads/${filename}`
            imageUrls.push(fileUrl)

            console.log(`Изображение ${index + 1} сохранено:`, fileUrl)
          } catch (error) {
            console.error(`Ошибка сохранения изображения ${image.name}:`, error)
            throw error
          }
        })

        await Promise.all(imagePromises)

        // Обновляем объект с URL изображений
        if (imageUrls.length > 0) {
          await prisma.property.update({
            where: { id: property.id },
            data: { images: imageUrls }
          })
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...property,
          images: imageUrls
        }
      })

    } catch (error) {
      console.error('Ошибка валидации или создания:', error)
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Ошибка валидации данных' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}