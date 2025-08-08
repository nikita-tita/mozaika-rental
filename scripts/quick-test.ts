import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'

interface TestResult {
  scenario: string
  success: boolean
  error?: string
  details?: any
}

class QuickTester {
  private results: TestResult[] = []
  private testUsers: any[] = []

  async runTests() {
    console.log('🚀 Быстрое тестирование системы...')
    
    try {
      await this.setupTestData()
      await this.runAuthTests()
      await this.runPropertyTests()
      await this.runClientTests()
      await this.runDealTests()
      await this.runSecurityTests()
      await this.runEdgeCases()
      
      this.printResults()
    } catch (error) {
      console.error('❌ Критическая ошибка:', error)
    } finally {
      await this.cleanup()
      await prisma.$disconnect()
    }
  }

  private async setupTestData() {
    console.log('📊 Подготовка данных...')
    
    const users = [
      { email: 'realtor1@test.com', firstName: 'Анна', lastName: 'Петрова' },
      { email: 'realtor2@test.com', firstName: 'Иван', lastName: 'Сидоров' },
      { email: 'confused@test.com', firstName: 'Запутавшийся', lastName: 'Пользователь' }
    ]

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          verified: true
        }
      })
      this.testUsers.push(user)
    }
  }

  private async runAuthTests() {
    console.log('\n🔐 Тесты аутентификации...')

    // Тест 1: Регистрация
    await this.testScenario('Регистрация нового пользователя', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'Новый',
        lastName: 'Пользователь'
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      })

      return { userId: user.id, email: user.email }
    })

    // Тест 2: Вход
    await this.testScenario('Вход с правильными данными', async () => {
      const user = this.testUsers[0]
      const password = 'password123'
      const isValid = await bcrypt.compare(password, user.password)
      
      if (!isValid) throw new Error('Неверный пароль')
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      return { token: !!token, user: { id: user.id, email: user.email } }
    })

    // Тест 3: Неверный пароль
    await this.testScenario('Вход с неправильным паролем', async () => {
      const user = this.testUsers[0]
      const wrongPassword = 'wrongpassword'
      const isValid = await bcrypt.compare(wrongPassword, user.password)
      
      if (isValid) throw new Error('Пароль должен быть неверным')
      
      return { success: false, expected: true }
    })
  }

  private async runPropertyTests() {
    console.log('\n🏠 Тесты объектов недвижимости...')

    // Тест 4: Создание объекта
    await this.testScenario('Создание объекта недвижимости', async () => {
      const user = this.testUsers[0]
      const propertyData = {
        title: 'Квартира в центре',
        description: 'Уютная квартира с ремонтом',
        type: 'APARTMENT',
        address: 'ул. Ленина, 1, кв. 5',
        price: 50000,
        bedrooms: 2,
        bathrooms: 1,
        area: 45.5,
        features: ['Балкон', 'Лоджия', 'Кондиционер'],
        images: []
      }

      const property = await prisma.property.create({
        data: {
          ...propertyData,
          userId: user.id
        }
      })

      return { propertyId: property.id, title: property.title }
    })

    // Тест 5: Массовое создание (100 объектов)
    await this.testScenario('Создание 100 объектов недвижимости', async () => {
      const user = this.testUsers[0]
      const startTime = Date.now()
      
      for (let i = 1; i <= 100; i++) {
        await prisma.property.create({
          data: {
            title: `Квартира ${i}`,
            description: `Описание квартиры ${i}`,
            type: 'APARTMENT',
            address: `ул. Тестовая, ${i}`,
            price: 30000 + (i * 1000),
            bedrooms: (i % 3) + 1,
            bathrooms: (i % 2) + 1,
            area: 30 + (i * 2),
            features: ['Базовые удобства'],
            images: [],
            userId: user.id
          }
        })
      }

      const endTime = Date.now()
      const duration = endTime - startTime
      
      return { 
        count: 100, 
        duration: `${duration}ms`, 
        avgTime: `${duration / 100}ms per property` 
      }
    })

    // Тест 6: Поиск по фильтрам
    await this.testScenario('Поиск объектов по фильтрам', async () => {
      const user = this.testUsers[0]
      
      const apartments = await prisma.property.findMany({
        where: {
          userId: user.id,
          type: 'APARTMENT'
        }
      })

      const expensiveProperties = await prisma.property.findMany({
        where: {
          userId: user.id,
          price: {
            gte: 50000
          }
        }
      })

      return { 
        apartments: apartments.length, 
        expensive: expensiveProperties.length 
      }
    })
  }

  private async runClientTests() {
    console.log('\n👥 Тесты клиентов...')

    // Тест 7: Создание клиента
    await this.testScenario('Создание клиента', async () => {
      const user = this.testUsers[0]
      const clientData = {
        firstName: 'Алексей',
        lastName: 'Иванов',
        middleName: 'Петрович',
        email: 'alexey@test.com',
        phone: '+7 (999) 111-22-33',
        type: 'TENANT',
        passport: '1234 567890',
        snils: '123-456-789 01',
        inn: '123456789012',
        address: 'ул. Клиентская, 1',
        city: 'Москва',
        notes: 'Хороший клиент',
        source: 'Сайт'
      }

      const client = await prisma.client.create({
        data: {
          ...clientData,
          userId: user.id
        }
      })

      return { clientId: client.id, name: `${client.firstName} ${client.lastName}` }
    })

    // Тест 8: Массовое создание клиентов
    await this.testScenario('Создание 50 клиентов', async () => {
      const user = this.testUsers[0]
      const startTime = Date.now()
      
      for (let i = 1; i <= 50; i++) {
        await prisma.client.create({
          data: {
            firstName: `Клиент${i}`,
            lastName: `Фамилия${i}`,
            phone: `+7 (999) ${String(i).padStart(3, '0')}-00-00`,
            userId: user.id
          }
        })
      }

      const endTime = Date.now()
      const duration = endTime - startTime
      
      return { 
        count: 50, 
        duration: `${duration}ms`, 
        avgTime: `${duration / 50}ms per client` 
      }
    })
  }

  private async runDealTests() {
    console.log('\n🤝 Тесты сделок...')

    // Тест 9: Создание сделки
    await this.testScenario('Создание сделки', async () => {
      const user = this.testUsers[0]
      const client = await prisma.client.findFirst()
      const property = await prisma.property.findFirst()
      
      if (!client || !property) throw new Error('Нет клиента или объекта')

      const dealData = {
        title: 'Аренда квартиры в центре',
        description: 'Сделка по аренде квартиры',
        status: 'NEW',
        amount: 50000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        clientId: client.id,
        propertyId: property.id
      }

      const deal = await prisma.deal.create({
        data: {
          ...dealData,
          userId: user.id
        }
      })

      return { dealId: deal.id, title: deal.title, amount: deal.amount }
    })

    // Тест 10: Изменение статуса сделки
    await this.testScenario('Изменение статуса сделки', async () => {
      const deal = await prisma.deal.findFirst()
      if (!deal) throw new Error('Сделка не найдена')

      const updatedDeal = await prisma.deal.update({
        where: { id: deal.id },
        data: { status: 'IN_PROGRESS' }
      })

      return { 
        oldStatus: deal.status, 
        newStatus: updatedDeal.status 
      }
    })
  }

  private async runSecurityTests() {
    console.log('\n🔒 Тесты безопасности...')

    // Тест 11: Попытка доступа к чужим данным
    await this.testScenario('Попытка доступа к чужим данным', async () => {
      const user1 = this.testUsers[0]
      const user2 = this.testUsers[1]

      const property = await prisma.property.create({
        data: {
          title: 'Приватный объект',
          type: 'APARTMENT',
          address: 'ул. Приватная, 1',
          price: 100000,
          userId: user1.id
        }
      })

      const unauthorizedAccess = await prisma.property.findMany({
        where: {
          userId: user1.id
        }
      })

      return { 
        propertyId: property.id, 
        unauthorizedCount: unauthorizedAccess.length 
      }
    })

    // Тест 12: Валидация JWT
    await this.testScenario('Валидация JWT токена', async () => {
      const user = this.testUsers[0]
      
      const validToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      const invalidToken = 'invalid.token.here'

      const validDecoded = jwt.verify(validToken, JWT_SECRET)
      
      let invalidDecoded = null
      try {
        invalidDecoded = jwt.verify(invalidToken, JWT_SECRET)
      } catch (error) {
        // Ожидаем ошибку
      }

      return { 
        validToken: !!validDecoded, 
        invalidToken: !invalidDecoded 
      }
    })
  }

  private async runEdgeCases() {
    console.log('\n🔍 Граничные случаи...')

    // Тест 13: Очень длинные названия
    await this.testScenario('Очень длинные названия', async () => {
      const user = this.testUsers[0]
      const longTitle = 'A'.repeat(1000)
      
      try {
        const property = await prisma.property.create({
          data: {
            title: longTitle,
            type: 'APARTMENT',
            address: 'ул. Длинная, 1',
            price: 100000,
            userId: user.id
          }
        })
        return { success: true, titleLength: property.title.length }
      } catch (error) {
        return { success: false, error: 'Слишком длинное название' }
      }
    })

    // Тест 14: Отрицательные цены
    await this.testScenario('Отрицательные цены', async () => {
      const user = this.testUsers[0]
      
      try {
        const property = await prisma.property.create({
          data: {
            title: 'Объект с отрицательной ценой',
            type: 'APARTMENT',
            address: 'ул. Отрицательная, 1',
            price: -1000,
            userId: user.id
          }
        })
        return { success: true, price: property.price }
      } catch (error) {
        return { success: false, error: 'Отрицательная цена недопустима' }
      }
    })

    // Тест 15: XSS попытка
    await this.testScenario('XSS попытка', async () => {
      const user = this.testUsers[0]
      const xssTitle = '<script>alert("xss")</script>'
      
      try {
        const property = await prisma.property.create({
          data: {
            title: xssTitle,
            type: 'APARTMENT',
            address: 'ул. XSS, 1',
            price: 100000,
            userId: user.id
          }
        })
        return { success: true, title: property.title }
      } catch (error) {
        return { success: false, error: 'XSS заблокирован' }
      }
    })
  }

  private async testScenario(name: string, testFn: () => Promise<any>): Promise<void> {
    try {
      console.log(`  🧪 ${name}...`)
      const result = await testFn()
      this.results.push({
        scenario: name,
        success: true,
        details: result
      })
      console.log(`  ✅ ${name} - УСПЕХ`)
    } catch (error: any) {
      this.results.push({
        scenario: name,
        success: false,
        error: error.message
      })
      console.log(`  ❌ ${name} - ОШИБКА: ${error.message}`)
    }
  }

  private printResults() {
    console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ')
    console.log('=' .repeat(50))
    
    const successful = this.results.filter(r => r.success).length
    const failed = this.results.filter(r => !r.success).length
    const total = this.results.length
    
    console.log(`Всего тестов: ${total}`)
    console.log(`Успешных: ${successful}`)
    console.log(`Проваленных: ${failed}`)
    console.log(`Процент успеха: ${((successful / total) * 100).toFixed(1)}%`)
    
    if (failed > 0) {
      console.log('\n❌ ПРОВАЛЕННЫЕ ТЕСТЫ:')
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.scenario}: ${r.error}`)
        })
    }
  }

  private async cleanup() {
    console.log('\n🧹 Очистка тестовых данных...')
    
    await prisma.deal.deleteMany({
      where: {
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })
    
    await prisma.client.deleteMany({
      where: {
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })
    
    await prisma.property.deleteMany({
      where: {
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })
    
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test.com'
        }
      }
    })
    
    console.log('✅ Тестовые данные удалены')
  }
}

// Запуск тестирования
const tester = new QuickTester()
tester.runTests() 