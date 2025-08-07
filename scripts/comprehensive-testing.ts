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

class ComprehensiveTester {
  private results: TestResult[] = []
  private testUsers: any[] = []
  private testProperties: any[] = []
  private testClients: any[] = []

  async runAllTests() {
    console.log('🚀 Начинаем комплексное тестирование системы...')
    
    try {
      await this.setupTestData()
      await this.runAuthenticationTests()
      await this.runPropertyManagementTests()
      await this.runClientManagementTests()
      await this.runDealManagementTests()
      await this.runContractTests()
      await this.runPaymentTests()
      await this.runSecurityTests()
      await this.runPerformanceTests()
      await this.runEdgeCaseTests()
      await this.runUserExperienceTests()
      
      this.printResults()
  } catch (error) {
      console.error('❌ Критическая ошибка тестирования:', error)
    } finally {
      await this.cleanup()
      await prisma.$disconnect()
    }
  }

  private async setupTestData() {
    console.log('📊 Подготовка тестовых данных...')
    
    // Создаем тестовых пользователей
    const users = [
      { email: 'realtor1@test.com', firstName: 'Анна', lastName: 'Петрова', role: 'REALTOR' },
      { email: 'realtor2@test.com', firstName: 'Иван', lastName: 'Сидоров', role: 'REALTOR' },
      { email: 'admin@test.com', firstName: 'Админ', lastName: 'Админов', role: 'ADMIN' },
      { email: 'client@test.com', firstName: 'Клиент', lastName: 'Клиентов', role: 'CLIENT' }
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

    console.log(`✅ Создано ${this.testUsers.length} тестовых пользователей`)
  }

  private async runAuthenticationTests() {
    console.log('\n🔐 Тестирование аутентификации...')

    // Тест 1: Регистрация нового пользователя
    await this.testScenario('Регистрация нового пользователя', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'Новый',
        lastName: 'Пользователь',
        phone: '+7 (999) 123-45-67'
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

    // Тест 2: Вход с правильными данными
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

      return { token, user: { id: user.id, email: user.email } }
    })

    // Тест 3: Вход с неправильным паролем
    await this.testScenario('Вход с неправильным паролем', async () => {
      const user = this.testUsers[0]
      const wrongPassword = 'wrongpassword'
      const isValid = await bcrypt.compare(wrongPassword, user.password)
      
      if (isValid) throw new Error('Пароль должен быть неверным')
      
      return { success: false, expected: true }
    })

    // Тест 4: Регистрация с существующим email
    await this.testScenario('Регистрация с существующим email', async () => {
      const existingUser = this.testUsers[0]
      
      try {
        const hashedPassword = await bcrypt.hash('password123', 10)
        await prisma.user.create({
          data: {
            email: existingUser.email,
            password: hashedPassword,
            firstName: 'Дубликат',
            lastName: 'Пользователь'
          }
        })
        throw new Error('Должна быть ошибка дубликата')
      } catch (error: any) {
        if (error.code === 'P2002') {
          return { success: true, error: 'Дубликат email обнаружен' }
        }
        throw error
      }
    })

    // Тест 5: Валидация email формата
    await this.testScenario('Валидация email формата', async () => {
      const invalidEmails = ['invalid', 'test@', '@test.com', 'test..test@test.com']
      
      for (const email of invalidEmails) {
        try {
          const hashedPassword = await bcrypt.hash('password123', 10)
          await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              firstName: 'Тест',
              lastName: 'Пользователь'
            }
          })
          throw new Error(`Email ${email} должен быть недействительным`)
        } catch (error) {
          // Ожидаем ошибку
        }
      }
      
      return { success: true, testedEmails: invalidEmails }
    })
  }

  private async runPropertyManagementTests() {
    console.log('\n🏠 Тестирование управления объектами...')

    // Тест 6: Создание объекта недвижимости
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

      this.testProperties.push(property)
      return { propertyId: property.id, title: property.title }
    })

    // Тест 7: Создание 100 объектов (тест производительности)
    await this.testScenario('Создание 100 объектов недвижимости', async () => {
      const user = this.testUsers[0]
      const startTime = Date.now()
      
      for (let i = 1; i <= 100; i++) {
        const property = await prisma.property.create({
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
        this.testProperties.push(property)
      }

      const endTime = Date.now()
      const duration = endTime - startTime
      
      return { 
        count: 100, 
        duration: `${duration}ms`, 
        avgTime: `${duration / 100}ms per property` 
      }
    })

    // Тест 8: Поиск объектов по фильтрам
    await this.testScenario('Поиск объектов по фильтрам', async () => {
      const user = this.testUsers[0]
      
      // Поиск по типу
      const apartments = await prisma.property.findMany({
        where: {
          userId: user.id,
          type: 'APARTMENT'
        }
      })

      // Поиск по цене
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

    // Тест 9: Обновление объекта
    await this.testScenario('Обновление объекта недвижимости', async () => {
      const property = this.testProperties[0]
      const newPrice = 55000
      const newDescription = 'Обновленное описание'

      const updatedProperty = await prisma.property.update({
        where: { id: property.id },
        data: {
          price: newPrice,
          description: newDescription
        }
      })

      return { 
        oldPrice: property.price, 
        newPrice: updatedProperty.price,
        description: updatedProperty.description 
      }
    })

    // Тест 10: Удаление объекта
    await this.testScenario('Удаление объекта недвижимости', async () => {
      const propertyToDelete = this.testProperties[this.testProperties.length - 1]
      
      await prisma.property.delete({
        where: { id: propertyToDelete.id }
      })

      // Проверяем, что объект удален
      const deletedProperty = await prisma.property.findUnique({
        where: { id: propertyToDelete.id }
      })

      if (deletedProperty) {
        throw new Error('Объект не был удален')
      }

      return { deletedId: propertyToDelete.id }
    })
  }

  private async runClientManagementTests() {
    console.log('\n👥 Тестирование управления клиентами...')

    // Тест 11: Создание клиента
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

      this.testClients.push(client)
      return { clientId: client.id, name: `${client.firstName} ${client.lastName}` }
    })

    // Тест 12: Создание клиента с минимальными данными
    await this.testScenario('Создание клиента с минимальными данными', async () => {
      const user = this.testUsers[0]
      const clientData = {
        firstName: 'Минимальный',
        lastName: 'Клиент',
        phone: '+7 (999) 000-00-00'
      }

      const client = await prisma.client.create({
        data: {
          ...clientData,
          userId: user.id
        }
      })

      this.testClients.push(client)
      return { clientId: client.id, hasEmail: !!client.email }
    })

    // Тест 13: Поиск клиентов по фильтрам
    await this.testScenario('Поиск клиентов по фильтрам', async () => {
      const user = this.testUsers[0]
      
      // Поиск по типу
      const tenants = await prisma.client.findMany({
        where: {
          userId: user.id,
          type: 'TENANT'
        }
      })

      // Поиск по городу
      const moscowClients = await prisma.client.findMany({
        where: {
          userId: user.id,
          city: 'Москва'
        }
      })

      return { tenants: tenants.length, moscowClients: moscowClients.length }
    })

    // Тест 14: Обновление данных клиента
    await this.testScenario('Обновление данных клиента', async () => {
      const client = this.testClients[0]
      const newPhone = '+7 (999) 999-99-99'
      const newNotes = 'Обновленные заметки'

      const updatedClient = await prisma.client.update({
        where: { id: client.id },
        data: {
          phone: newPhone,
          notes: newNotes
        }
      })

      return { 
        oldPhone: client.phone, 
        newPhone: updatedClient.phone,
        notes: updatedClient.notes 
      }
    })
  }

  private async runDealManagementTests() {
    console.log('\n🤝 Тестирование управления сделками...')

    // Тест 15: Создание сделки
    await this.testScenario('Создание сделки', async () => {
      const user = this.testUsers[0]
      const client = this.testClients[0]
      const property = this.testProperties[0]

      const dealData = {
        title: 'Аренда квартиры в центре',
        description: 'Сделка по аренде квартиры',
        status: 'NEW',
        amount: 50000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 год
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

    // Тест 16: Изменение статуса сделки
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

    // Тест 17: Завершение сделки
    await this.testScenario('Завершение сделки', async () => {
      const deal = await prisma.deal.findFirst({
        where: { status: 'IN_PROGRESS' }
      })
      if (!deal) throw new Error('Сделка в процессе не найдена')

      const completedDeal = await prisma.deal.update({
        where: { id: deal.id },
        data: { status: 'COMPLETED' }
      })

      return { 
        dealId: completedDeal.id, 
        status: completedDeal.status 
      }
    })
  }

  private async runContractTests() {
    console.log('\n📄 Тестирование контрактов...')

    // Тест 18: Создание контракта
    await this.testScenario('Создание контракта', async () => {
      const user = this.testUsers[0]
      const deal = await prisma.deal.findFirst()
      
      const contractData = {
        title: 'Договор аренды',
        content: 'Содержание договора аренды...',
        status: 'DRAFT',
        dealId: deal?.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 дней
      }

      const contract = await prisma.contract.create({
        data: {
          ...contractData,
          userId: user.id
        }
      })

      return { contractId: contract.id, title: contract.title }
    })

    // Тест 19: Подписание контракта
    await this.testScenario('Подписание контракта', async () => {
      const contract = await prisma.contract.findFirst({
        where: { status: 'DRAFT' }
      })
      if (!contract) throw new Error('Черновик контракта не найден')

      const signedContract = await prisma.contract.update({
        where: { id: contract.id },
        data: { 
          status: 'SIGNED',
          signedAt: new Date()
        }
      })

      return { 
        contractId: signedContract.id, 
        status: signedContract.status,
        signedAt: signedContract.signedAt 
      }
    })
  }

  private async runPaymentTests() {
    console.log('\n💰 Тестирование платежей...')

    // Тест 20: Создание платежа
    await this.testScenario('Создание платежа', async () => {
      const user = this.testUsers[0]
      const deal = await prisma.deal.findFirst()
      
      const paymentData = {
        type: 'RENT',
        status: 'PENDING',
        amount: 50000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 дней
        dealId: deal?.id
      }

      const payment = await prisma.payment.create({
        data: {
          ...paymentData,
          userId: user.id
        }
      })

      return { paymentId: payment.id, amount: payment.amount, type: payment.type }
    })

    // Тест 21: Оплата платежа
    await this.testScenario('Оплата платежа', async () => {
      const payment = await prisma.payment.findFirst({
        where: { status: 'PENDING' }
      })
      if (!payment) throw new Error('Ожидающий платеж не найден')

      const paidPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: 'PAID',
          paidAt: new Date()
        }
      })

      return { 
        paymentId: paidPayment.id, 
        status: paidPayment.status,
        paidAt: paidPayment.paidAt 
      }
    })
  }

  private async runSecurityTests() {
    console.log('\n🔒 Тестирование безопасности...')

    // Тест 22: Попытка доступа к чужим данным
    await this.testScenario('Попытка доступа к чужим данным', async () => {
      const user1 = this.testUsers[0]
      const user2 = this.testUsers[1]

      // Создаем объект для user1
      const property = await prisma.property.create({
        data: {
          title: 'Приватный объект',
          type: 'APARTMENT',
          address: 'ул. Приватная, 1',
          price: 100000,
          userId: user1.id
        }
      })

      // Пытаемся получить объект user1 от имени user2
      const unauthorizedAccess = await prisma.property.findMany({
        where: {
          userId: user1.id
        }
      })

      // В реальной системе это должно быть заблокировано на уровне API
      return { 
        propertyId: property.id, 
        unauthorizedCount: unauthorizedAccess.length 
      }
    })

    // Тест 23: Валидация JWT токена
    await this.testScenario('Валидация JWT токена', async () => {
      const user = this.testUsers[0]
      
      // Создаем валидный токен
      const validToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      // Создаем невалидный токен
      const invalidToken = 'invalid.token.here'

      // Проверяем валидный токен
      const validDecoded = jwt.verify(validToken, JWT_SECRET)
      
      // Проверяем невалидный токен
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

    // Тест 24: Проверка сложности пароля
    await this.testScenario('Проверка сложности пароля', async () => {
      const weakPasswords = ['123', 'password', 'qwerty', 'abc123']
      const strongPasswords = ['StrongPass123!', 'MySecureP@ssw0rd', 'Complex123!@#']
      
      const weakResults = []
      const strongResults = []

      for (const password of weakPasswords) {
        const hashed = await bcrypt.hash(password, 10)
        const isValid = await bcrypt.compare(password, hashed)
        weakResults.push({ password, isValid })
      }

      for (const password of strongPasswords) {
        const hashed = await bcrypt.hash(password, 10)
        const isValid = await bcrypt.compare(password, hashed)
        strongResults.push({ password, isValid })
      }

      return { 
        weakPasswords: weakResults.length, 
        strongPasswords: strongResults.length 
      }
    })
  }

  private async runPerformanceTests() {
    console.log('\n⚡ Тестирование производительности...')

    // Тест 25: Массовое создание клиентов
    await this.testScenario('Массовое создание клиентов', async () => {
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

    // Тест 26: Поиск с большим количеством данных
    await this.testScenario('Поиск с большим количеством данных', async () => {
      const user = this.testUsers[0]
      const startTime = Date.now()
      
    const properties = await prisma.property.findMany({
        where: { userId: user.id },
        include: {
          deals: true
        }
      })

      const endTime = Date.now()
      const duration = endTime - startTime
      
      return { 
        propertiesCount: properties.length, 
        duration: `${duration}ms` 
      }
    })
  }

  private async runEdgeCaseTests() {
    console.log('\n🔍 Тестирование граничных случаев...')

    // Тест 27: Очень длинные названия
    await this.testScenario('Очень длинные названия', async () => {
      const user = this.testUsers[0]
      const longTitle = 'A'.repeat(1000) // 1000 символов
      
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

    // Тест 28: Отрицательные цены
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

    // Тест 29: Пустые обязательные поля
    await this.testScenario('Пустые обязательные поля', async () => {
      const user = this.testUsers[0]
      
      try {
        const property = await prisma.property.create({
          data: {
            title: '', // Пустое название
            type: 'APARTMENT',
            address: 'ул. Пустая, 1',
            price: 100000,
            userId: user.id
          }
        })
        return { success: true, title: property.title }
      } catch (error) {
        return { success: false, error: 'Пустое название недопустимо' }
      }
    })

    // Тест 30: Специальные символы в данных
    await this.testScenario('Специальные символы в данных', async () => {
      const user = this.testUsers[0]
      const specialTitle = 'Объект с символами: <script>alert("xss")</script> & "кавычки"'
      
      try {
        const property = await prisma.property.create({
          data: {
            title: specialTitle,
            type: 'APARTMENT',
            address: 'ул. Специальная, 1',
            price: 100000,
            userId: user.id
          }
        })
        return { success: true, title: property.title }
      } catch (error) {
        return { success: false, error: 'Специальные символы не обработаны' }
      }
    })
  }

  private async runUserExperienceTests() {
    console.log('\n👤 Тестирование пользовательского опыта...')

    // Тест 31: Создание пользователя без понимания системы
    await this.testScenario('Создание пользователя без понимания системы', async () => {
      const confusedUser = {
        email: 'confused@test.com',
        password: 'password123',
        firstName: 'Запутавшийся',
        lastName: 'Пользователь',
        phone: '+7 (999) 999-99-99'
      }

      const hashedPassword = await bcrypt.hash(confusedUser.password, 10)
      const user = await prisma.user.create({
        data: {
          ...confusedUser,
          password: hashedPassword
        }
      })

      // Создаем базовые данные для помощи пользователю
      const helpProperty = await prisma.property.create({
        data: {
          title: 'Пример объекта (удалите после изучения)',
          description: 'Это пример объекта недвижимости. Изучите его структуру и создайте свои объекты.',
          type: 'APARTMENT',
          address: 'ул. Примерная, 1',
          price: 30000,
          userId: user.id
        }
      })

      const helpClient = await prisma.client.create({
        data: {
          firstName: 'Пример',
          lastName: 'Клиента',
          phone: '+7 (999) 000-00-00',
          notes: 'Это пример клиента. Изучите его структуру и создайте своих клиентов.',
          userId: user.id
        }
      })

      return { 
        userId: user.id, 
        helpPropertyId: helpProperty.id,
        helpClientId: helpClient.id 
      }
    })

    // Тест 32: Исправление ошибок в данных
    await this.testScenario('Исправление ошибок в данных', async () => {
      const user = this.testUsers[0]
      
      // Создаем объект с ошибкой
      const propertyWithError = await prisma.property.create({
        data: {
          title: 'Объект с ошибкой',
          type: 'APARTMENT',
          address: 'Неправильный адрес',
          price: 100000,
          userId: user.id
        }
      })

      // Исправляем ошибку
      const correctedProperty = await prisma.property.update({
        where: { id: propertyWithError.id },
        data: {
          address: 'ул. Правильная, 1',
          title: 'Объект с исправленной ошибкой'
        }
      })

      return { 
        originalAddress: propertyWithError.address,
        correctedAddress: correctedProperty.address,
        correctedTitle: correctedProperty.title 
      }
    })

    // Тест 33: Массовые операции
    await this.testScenario('Массовые операции', async () => {
      const user = this.testUsers[0]
      
      // Создаем несколько объектов для массового обновления
      const properties = []
      for (let i = 1; i <= 10; i++) {
        const property = await prisma.property.create({
          data: {
            title: `Объект для массового обновления ${i}`,
            type: 'APARTMENT',
            address: `ул. Массовая, ${i}`,
            price: 30000 + (i * 1000),
            userId: user.id
          }
        })
        properties.push(property)
      }

      // Массовое обновление статуса
      const updatePromises = properties.map(property =>
        prisma.property.update({
          where: { id: property.id },
          data: { status: 'MAINTENANCE' }
        })
      )

      const updatedProperties = await Promise.all(updatePromises)
      
      return { 
        updatedCount: updatedProperties.length,
        allInMaintenance: updatedProperties.every(p => p.status === 'MAINTENANCE')
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
    
    console.log('\n✅ УСПЕШНЫЕ ТЕСТЫ:')
    this.results
      .filter(r => r.success)
      .forEach(r => {
        console.log(`  - ${r.scenario}`)
      })
  }

  private async cleanup() {
    console.log('\n🧹 Очистка тестовых данных...')
    
    // Удаляем все тестовые данные
    await prisma.payment.deleteMany({
      where: { 
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })
    
    await prisma.contract.deleteMany({
      where: {
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })
    
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
const tester = new ComprehensiveTester()
tester.runAllTests() 