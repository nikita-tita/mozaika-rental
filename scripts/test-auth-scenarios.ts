import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAuthScenarios() {
  console.log('🧪 Начинаем тестирование сценариев авторизации...')
  
  try {
    // 1. Очищаем базу данных
    console.log('\n1️⃣ Очистка базы данных...')
    await prisma.user.deleteMany({})
    console.log('✅ База данных очищена')
    
    // 2. Создаем тестового пользователя
    console.log('\n2️⃣ Создание тестового пользователя...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', // password: test123
        firstName: 'Тест',
        lastName: 'Пользователь',
        role: 'REALTOR',
        phone: '+7 (999) 123-45-67'
      }
    })
    console.log('✅ Тестовый пользователь создан:', testUser.email)
    
    // 3. Тестируем API endpoints
    console.log('\n3️⃣ Тестирование API endpoints...')
    
    // Тест регистрации
    console.log('\n📝 Тест регистрации...')
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'newpassword123',
        firstName: 'Новый',
        lastName: 'Пользователь',
        phone: '+7 (999) 999-99-99'
      })
    })
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('✅ Регистрация успешна:', registerData.success)
    } else {
      console.log('❌ Ошибка регистрации:', registerResponse.status)
    }
    
    // Тест входа
    console.log('\n🔐 Тест входа...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    })
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('✅ Вход успешен:', loginData.success)
      
      // Проверяем cookie
      const cookies = loginResponse.headers.get('set-cookie')
      console.log('🍪 Cookie установлен:', !!cookies)
      
      // Тест получения данных пользователя
      console.log('\n👤 Тест получения данных пользователя...')
      const meResponse = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Cookie': `auth-token=${loginData.token}`
        }
      })
      
      if (meResponse.ok) {
        const meData = await meResponse.json()
        console.log('✅ Данные пользователя получены:', meData.success)
      } else {
        console.log('❌ Ошибка получения данных пользователя:', meResponse.status)
      }
      
    } else {
      console.log('❌ Ошибка входа:', loginResponse.status)
    }
    
    // 4. Проверяем защищенные маршруты
    console.log('\n4️⃣ Тестирование защищенных маршрутов...')
    
    const protectedRoutes = [
      '/clients',
      '/properties',
      '/mosaic',
      '/dashboard'
    ]
    
    for (const route of protectedRoutes) {
      console.log(`\n🔒 Тест маршрута: ${route}`)
      const routeResponse = await fetch(`http://localhost:3000${route}`)
      console.log(`Статус: ${routeResponse.status}`)
    }
    
    // 5. Тест выхода
    console.log('\n5️⃣ Тест выхода...')
    const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST'
    })
    
    if (logoutResponse.ok) {
      console.log('✅ Выход успешен')
    } else {
      console.log('❌ Ошибка выхода:', logoutResponse.status)
    }
    
    console.log('\n🎉 Тестирование завершено!')
    
  } catch (error) {
    console.error('💥 Ошибка при тестировании:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем тесты только если скрипт вызван напрямую
if (require.main === module) {
  testAuthScenarios()
}

export { testAuthScenarios } 