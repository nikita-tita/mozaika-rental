#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuthSystem() {
  console.log('🧪 Тестирование системы авторизации...\n')

  try {
    // 1. Проверяем подключение к базе данных
    console.log('1️⃣ Проверка подключения к базе данных...')
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно\n')

    // 2. Проверяем существование тестового пользователя
    console.log('2️⃣ Проверка тестового пользователя...')
    const testUser = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })

    if (!testUser) {
      console.log('❌ Тестовый пользователь не найден')
      console.log('🔧 Создаем тестового пользователя...')
      
      const hashedPassword = await bcryptjs.hash('password123', 12)
      
      const newUser = await prisma.user.create({
        data: {
          email: 'nikitatitov070@gmail.com',
          password: hashedPassword,
          firstName: 'Никита',
          lastName: 'Титов',
          role: 'REALTOR',
          verified: true,
          phone: '+7 (999) 123-45-67'
        }
      })
      
      console.log('✅ Тестовый пользователь создан:', newUser.email)
    } else {
      console.log('✅ Тестовый пользователь найден:', testUser.email)
    }
    console.log()

    // 3. Проверяем сессии
    console.log('3️⃣ Проверка сессий...')
    const sessions = await prisma.session.findMany({
      include: { user: true }
    })
    
    console.log(`📊 Найдено сессий: ${sessions.length}`)
    
    if (sessions.length > 0) {
      console.log('📋 Активные сессии:')
      sessions.forEach((session, index) => {
        console.log(`   ${index + 1}. ${session.user.email} - ${session.expiresAt}`)
      })
    }
    console.log()

    // 4. Очищаем истекшие сессии
    console.log('4️⃣ Очистка истекших сессий...')
    const expiredSessions = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    console.log(`🗑️ Удалено истекших сессий: ${expiredSessions.count}`)
    console.log()

    // 5. Тестируем хеширование паролей
    console.log('5️⃣ Тестирование хеширования паролей...')
    const testPassword = 'testpassword123'
    const hashedPassword = await bcryptjs.hash(testPassword, 12)
    const isValidPassword = await bcryptjs.compare(testPassword, hashedPassword)
    
    console.log(`🔑 Тестовый пароль: ${testPassword}`)
    console.log(`🔐 Хешированный пароль: ${hashedPassword.substring(0, 20)}...`)
    console.log(`✅ Проверка пароля: ${isValidPassword ? 'успешно' : 'неудачно'}`)
    console.log()

    // 6. Проверяем структуру базы данных
    console.log('6️⃣ Проверка структуры базы данных...')
    
    const userCount = await prisma.user.count()
    const clientCount = await prisma.client.count()
    const propertyCount = await prisma.property.count()
    const contractCount = await prisma.contract.count()
    const paymentCount = await prisma.payment.count()
    const notificationCount = await prisma.notification.count()
    
    console.log('📊 Статистика базы данных:')
    console.log(`   👥 Пользователи: ${userCount}`)
    console.log(`   👤 Клиенты: ${clientCount}`)
    console.log(`   🏠 Объекты: ${propertyCount}`)
    console.log(`   📄 Договоры: ${contractCount}`)
    console.log(`   💰 Платежи: ${paymentCount}`)
    console.log(`   🔔 Уведомления: ${notificationCount}`)
    console.log()

    // 7. Тестируем связи между данными
    console.log('7️⃣ Проверка связей между данными...')
    
    const userWithClients = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { clients: true }
    })
    
    if (userWithClients) {
      console.log(`✅ Пользователь ${userWithClients.email} имеет ${userWithClients.clients.length} клиентов`)
      
      if (userWithClients.clients.length > 0) {
        console.log('📋 Клиенты:')
        userWithClients.clients.forEach((client, index) => {
          console.log(`   ${index + 1}. ${client.firstName} ${client.lastName} (${client.type})`)
        })
      }
    }
    console.log()

    // 8. Проверяем валидность данных
    console.log('8️⃣ Проверка валидности данных...')
    
    // Получаем все договоры для проверки
    const allContracts = await prisma.contract.findMany()
    
    const invalidContracts = allContracts.filter(contract => {
      // Проверяем, что дата подписания не позже даты окончания
      if (contract.signedAt && contract.expiresAt && contract.signedAt > contract.expiresAt) {
        return true
      }
      return false
    })
    
    if (invalidContracts.length > 0) {
      console.log(`⚠️ Найдено ${invalidContracts.length} договоров с некорректными данными`)
      invalidContracts.forEach((contract, index) => {
        console.log(`   ${index + 1}. ID: ${contract.id}`)
        if (contract.signedAt && contract.expiresAt && contract.signedAt > contract.expiresAt) {
          console.log(`      ❌ Дата подписания (${contract.signedAt}) > Дата окончания (${contract.expiresAt})`)
        }
      })
    } else {
      console.log('✅ Все договоры имеют корректные данные')
    }
    console.log()

    console.log('🎉 Тестирование системы авторизации завершено успешно!')
    console.log('\n📋 Рекомендации:')
    console.log('   • Убедитесь, что JWT_SECRET установлен в переменных окружения')
    console.log('   • Проверьте настройки cookies в production')
    console.log('   • Регулярно очищайте истекшие сессии')
    console.log('   • Мониторьте попытки несанкционированного доступа')

  } catch (error) {
    console.error('❌ Ошибка при тестировании системы авторизации:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем тестирование
testAuthSystem()
  .then(() => {
    console.log('\n✅ Тестирование завершено')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Ошибка:', error)
    process.exit(1)
  }) 