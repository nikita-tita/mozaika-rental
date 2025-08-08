import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function loadMockData() {
  try {
    console.log('🚀 Начинаю загрузку моковых данных...')

    // 1. Создаем или обновляем пользователя
    const userEmail = 'nikitatitov070@gmail.com'
    const hashedPassword = await hashPassword('password123')

    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: {
        email: userEmail,
        password: hashedPassword,
        firstName: 'Никита',
        lastName: 'Титов',
        role: 'REALTOR',
        verified: true,
        phone: '+7 (999) 123-45-67'
      }
    })

    console.log('✅ Пользователь создан/обновлен:', user.email)

    // 2. Создаем клиентов
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          firstName: 'Анна',
          lastName: 'Петрова',
          middleName: 'Сергеевна',
          email: 'anna.petrova@email.com',
          phone: '+7 (916) 111-22-33',
          birthDate: new Date('1990-05-15'),
          type: 'TENANT',
          passport: '4510 123456',
          snils: '123-456-789 01',
          inn: '123456789012',
          address: 'г. Москва, ул. Тверская, д. 1, кв. 15',
          city: 'Москва',
          notes: 'Заинтересована в 2-3 комнатных квартирах',
          source: 'Сайт',
          isActive: true,
          userId: user.id
        }
      }),
      prisma.client.create({
        data: {
          firstName: 'Дмитрий',
          lastName: 'Сидоров',
          middleName: 'Александрович',
          email: 'dmitry.sidorov@email.com',
          phone: '+7 (903) 444-55-66',
          birthDate: new Date('1985-12-03'),
          type: 'LANDLORD',
          passport: '4511 654321',
          snils: '987-654-321 09',
          inn: '987654321098',
          address: 'г. Москва, ул. Арбат, д. 25, кв. 8',
          city: 'Москва',
          notes: 'Сдает 2 квартиры в центре',
          source: 'Рекомендация',
          isActive: true,
          userId: user.id
        }
      }),
      prisma.client.create({
        data: {
          firstName: 'Елена',
          lastName: 'Козлова',
          middleName: 'Владимировна',
          email: 'elena.kozlova@email.com',
          phone: '+7 (925) 777-88-99',
          birthDate: new Date('1992-08-20'),
          type: 'TENANT',
          passport: '4512 789012',
          snils: '456-789-012 34',
          inn: '456789012345',
          address: 'г. Москва, ул. Новый Арбат, д. 10, кв. 45',
          city: 'Москва',
          notes: 'Ищет квартиру для семьи с ребенком',
          source: 'Avito',
          isActive: true,
          userId: user.id
        }
      })
    ])

    console.log('✅ Создано клиентов:', clients.length)

    // 3. Создаем объекты недвижимости
    const properties = await Promise.all([
      prisma.property.create({
        data: {
          title: 'Уютная 2-комнатная квартира в центре',
          type: 'APARTMENT',
          address: 'г. Москва, ул. Тверская, д. 15, кв. 23',
          area: 65.5,
          bedrooms: 1,
          bathrooms: 1,
          price: 85000,
          description: 'Светлая квартира с ремонтом, меблированная, все удобства',
          images: ['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Квартира+1'],
          features: ['Меблированная', 'Ремонт', 'Центр'],
          userId: user.id
        }
      }),
      prisma.property.create({
        data: {
          title: 'Современная 3-комнатная квартира на Арбате',
          type: 'APARTMENT',
          address: 'г. Москва, ул. Арбат, д. 25, кв. 8',
          area: 89.0,
          bedrooms: 2,
          bathrooms: 2,
          price: 120000,
          description: 'Просторная квартира с дизайнерским ремонтом, панорамные окна',
          images: ['https://via.placeholder.com/400x300/10B981/FFFFFF?text=Квартира+2'],
          features: ['Дизайнерский ремонт', 'Панорамные окна', 'Премиум'],
          userId: user.id
        }
      }),
      prisma.property.create({
        data: {
          title: '1-комнатная квартира-студия на Новом Арбате',
          type: 'APARTMENT',
          address: 'г. Москва, ул. Новый Арбат, д. 10, кв. 45',
          area: 42.0,
          bedrooms: 0,
          bathrooms: 1,
          price: 65000,
          description: 'Компактная студия для одного человека, современный ремонт',
          images: ['https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Студия'],
          features: ['Студия', 'Современный ремонт', 'Компактная'],
          userId: user.id
        }
      })
    ])

    console.log('✅ Создано объектов недвижимости:', properties.length)

    // 4. Создаем договоры
    const contracts = await Promise.all([
      prisma.contract.create({
        data: {
          title: 'Договор аренды квартиры на Тверской',
          content: 'Договор аренды 2-комнатной квартиры по адресу: г. Москва, ул. Тверская, д. 15, кв. 23. Арендная плата: 85,000 руб/мес. Срок: 1 год.',
          status: 'SIGNED',
          signedAt: new Date('2024-01-15'),
          expiresAt: new Date('2025-01-15'),
          userId: user.id
        }
      }),
      prisma.contract.create({
        data: {
          title: 'Договор аренды квартиры на Арбате',
          content: 'Договор аренды 3-комнатной квартиры по адресу: г. Москва, ул. Арбат, д. 25, кв. 8. Арендная плата: 120,000 руб/мес. Срок: 1 год.',
          status: 'DRAFT',
          userId: user.id
        }
      })
    ])

    console.log('✅ Создано договоров:', contracts.length)

    // 5. Создаем платежи
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          amount: 85000,
          type: 'RENT',
          status: 'PAID',
          dueDate: new Date('2024-01-15'),
          paidAt: new Date('2024-01-15'),
          userId: user.id
        }
      }),
      prisma.payment.create({
        data: {
          amount: 85000,
          type: 'RENT',
          status: 'PAID',
          dueDate: new Date('2024-02-15'),
          paidAt: new Date('2024-02-15'),
          userId: user.id
        }
      }),
      prisma.payment.create({
        data: {
          amount: 85000,
          type: 'RENT',
          status: 'PENDING',
          dueDate: new Date('2024-03-15'),
          userId: user.id
        }
      })
    ])

    console.log('✅ Создано платежей:', payments.length)

    // 6. Создаем уведомления
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          title: 'Новый клиент',
          message: 'Добавлен новый клиент: Анна Петрова',
          type: 'INFO',
          read: false,
          userId: user.id
        }
      }),
      prisma.notification.create({
        data: {
          title: 'Платеж просрочен',
          message: 'Платеж за март 2024 просрочен на 5 дней',
          type: 'WARNING',
          read: false,
          userId: user.id
        }
      }),
      prisma.notification.create({
        data: {
          title: 'Договор подписан',
          message: 'Договор аренды квартиры на Тверской успешно подписан',
          type: 'SUCCESS',
          read: true,
          userId: user.id
        }
      })
    ])

    console.log('✅ Создано уведомлений:', notifications.length)

    console.log('🎉 Все моковые данные успешно загружены!')
    console.log('\n📊 Статистика:')
    console.log(`- Пользователей: 1`)
    console.log(`- Клиентов: ${clients.length}`)
    console.log(`- Объектов недвижимости: ${properties.length}`)
    console.log(`- Договоров: ${contracts.length}`)
    console.log(`- Платежей: ${payments.length}`)
    console.log(`- Уведомлений: ${notifications.length}`)

  } catch (error) {
    console.error('❌ Ошибка при загрузке моковых данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

loadMockData() 