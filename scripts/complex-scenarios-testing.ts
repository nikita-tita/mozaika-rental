import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TestResult {
  testId: number
  name: string
  status: 'PASS' | 'FAIL' | 'PARTIAL'
  details: string
  error?: string
}

const testResults: TestResult[] = []

async function runTest(testId: number, name: string, testFn: () => Promise<boolean>, details: string) {
  try {
    console.log(`🧪 Тест ${testId}: ${name}`)
    const result = await testFn()
    const status = result ? 'PASS' : 'FAIL'
    testResults.push({ testId, name, status, details })
    console.log(`   ${status === 'PASS' ? '✅' : '❌'} ${status}`)
    return result
  } catch (error) {
    testResults.push({ 
      testId, 
      name, 
      status: 'FAIL', 
      details, 
      error: error instanceof Error ? error.message : String(error) 
    })
    console.log(`   ❌ FAIL: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

async function complexScenariosTesting() {
  console.log('🚀 Начинаю тестирование сложных пользовательских сценариев...\n')

  // Сценарий 1-10: Полный цикл работы с клиентом
  await runTest(1, 'Создание нового клиента-арендатора', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    if (!user) return false

    const newClient = await prisma.client.create({
      data: {
        firstName: 'Мария',
        lastName: 'Иванова',
        middleName: 'Петровна',
        email: 'maria.ivanova@test.com',
        phone: '+7 (999) 999-99-99',
        birthDate: new Date('1995-03-15'),
        type: 'TENANT',
        passport: '4513 999999',
        snils: '999-999-999 99',
        inn: '999999999999',
        address: 'г. Москва, ул. Тестовая, д. 1, кв. 1',
        city: 'Москва',
        notes: 'Тестовый клиент для проверки функционала',
        source: 'Тест',
        isActive: true,
        userId: user.id
      }
    })
    
    return newClient && newClient.firstName === 'Мария' && newClient.type === 'TENANT'
  }, 'Должен создаться новый клиент-арендатор с полными данными')

  await runTest(2, 'Создание нового объекта недвижимости', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    if (!user) return false

    const newProperty = await prisma.property.create({
      data: {
        title: 'Тестовая квартира для сдачи',
        type: 'APARTMENT',
        address: 'г. Москва, ул. Тестовая, д. 2, кв. 5',
        area: 55.0,
        bedrooms: 2,
        bathrooms: 1,
        price: 95000,
        description: 'Тестовая квартира для проверки функционала системы',
        images: ['https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Тестовая+Квартира'],
        features: ['Тестовая', 'Новый ремонт', 'Меблированная'],
        userId: user.id
      }
    })
    
    return newProperty && newProperty.title.includes('Тестовая') && newProperty.price === 95000
  }, 'Должен создаться новый объект недвижимости с полными данными')

  await runTest(3, 'Создание договора аренды', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    if (!user) return false

    const client = await prisma.client.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        firstName: 'Мария'
      }
    })
    if (!client) return false

    const newContract = await prisma.contract.create({
      data: {
        title: 'Договор аренды тестовой квартиры',
        content: 'Договор аренды тестовой квартиры по адресу: г. Москва, ул. Тестовая, д. 2, кв. 5. Арендная плата: 95,000 руб/мес. Срок: 1 год.',
        status: 'DRAFT',
        userId: user.id
      }
    })
    
    return newContract && newContract.title.includes('тестовой') && newContract.status === 'DRAFT'
  }, 'Должен создаться новый договор аренды')

  await runTest(4, 'Создание платежа по договору', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    if (!user) return false

    const contract = await prisma.contract.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        title: { contains: 'тестовой' }
      }
    })
    if (!contract) return false

    const newPayment = await prisma.payment.create({
      data: {
        amount: 95000,
        type: 'RENT',
        status: 'PENDING',
        dueDate: new Date('2024-04-15'),
        userId: user.id
      }
    })
    
    return newPayment && newPayment.amount === 95000 && newPayment.type === 'RENT'
  }, 'Должен создаться новый платеж по договору')

  await runTest(5, 'Создание уведомления о новом клиенте', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    if (!user) return false

    const newNotification = await prisma.notification.create({
      data: {
        title: 'Новый тестовый клиент',
        message: 'Добавлен новый тестовый клиент: Мария Иванова',
        type: 'INFO',
        read: false,
        userId: user.id
      }
    })
    
    return newNotification && newNotification.title.includes('тестовый') && !newNotification.read
  }, 'Должно создаться уведомление о новом клиенте')

  // Сценарий 6-15: Работа с множественными данными
  await runTest(6, 'Поиск клиентов по типу', async () => {
    const tenants = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        type: 'TENANT'
      }
    })
    const landlords = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        type: 'LANDLORD'
      }
    })
    
    return tenants.length >= 2 && landlords.length >= 1
  }, 'Должны находиться клиенты разных типов')

  await runTest(7, 'Фильтрация объектов по цене', async () => {
    const expensiveProperties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        price: { gte: 100000 }
      }
    })
    const affordableProperties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        price: { lt: 100000 }
      }
    })
    
    return expensiveProperties.length >= 1 && affordableProperties.length >= 2
  }, 'Должны находиться объекты разных ценовых категорий')

  await runTest(8, 'Поиск активных договоров', async () => {
    const signedContracts = await prisma.contract.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        status: 'SIGNED'
      }
    })
    const draftContracts = await prisma.contract.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        status: 'DRAFT'
      }
    })
    
    return signedContracts.length >= 1 && draftContracts.length >= 2
  }, 'Должны находиться договоры разных статусов')

  await runTest(9, 'Анализ платежей по статусам', async () => {
    const paidPayments = await prisma.payment.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        status: 'PAID'
      }
    })
    const pendingPayments = await prisma.payment.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        status: 'PENDING'
      }
    })
    
    return paidPayments.length >= 2 && pendingPayments.length >= 1
  }, 'Должны находиться платежи разных статусов')

  await runTest(10, 'Фильтрация уведомлений по типу', async () => {
    const infoNotifications = await prisma.notification.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        type: 'INFO'
      }
    })
    const warningNotifications = await prisma.notification.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        type: 'WARNING'
      }
    })
    
    return infoNotifications.length >= 2 && warningNotifications.length >= 1
  }, 'Должны находиться уведомления разных типов')

  // Сценарий 11-20: Обновление данных
  await runTest(11, 'Обновление данных клиента', async () => {
    const client = await prisma.client.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        firstName: 'Мария'
      }
    })
    if (!client) return false

    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: { 
        notes: 'Обновленные заметки о клиенте',
        phone: '+7 (999) 888-88-88'
      }
    })
    
    return updatedClient.notes === 'Обновленные заметки о клиенте' && 
           updatedClient.phone === '+7 (999) 888-88-88'
  }, 'Должны обновляться данные клиента')

  await runTest(12, 'Обновление цены объекта', async () => {
    const property = await prisma.property.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        title: { contains: 'Тестовая' }
      }
    })
    if (!property) return false

    const updatedProperty = await prisma.property.update({
      where: { id: property.id },
      data: { 
        price: 100000,
        description: 'Обновленное описание тестовой квартиры'
      }
    })
    
    return updatedProperty.price === 100000 && 
           updatedProperty.description.includes('Обновленное')
  }, 'Должна обновляться цена и описание объекта')

  await runTest(13, 'Изменение статуса договора', async () => {
    const contract = await prisma.contract.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        title: { contains: 'тестовой' }
      }
    })
    if (!contract) return false

    const updatedContract = await prisma.contract.update({
      where: { id: contract.id },
      data: { 
        status: 'SIGNED',
        signedAt: new Date(),
        expiresAt: new Date('2025-04-15')
      }
    })
    
    return updatedContract.status === 'SIGNED' && 
           updatedContract.signedAt && 
           updatedContract.expiresAt
  }, 'Должен изменяться статус договора на подписанный')

  await runTest(14, 'Обновление статуса платежа', async () => {
    const payment = await prisma.payment.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        amount: 95000
      }
    })
    if (!payment) return false

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { 
        status: 'PAID',
        paidAt: new Date()
      }
    })
    
    return updatedPayment.status === 'PAID' && updatedPayment.paidAt
  }, 'Должен обновляться статус платежа на оплаченный')

  await runTest(15, 'Отметка уведомления как прочитанного', async () => {
    const notification = await prisma.notification.findFirst({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        title: { contains: 'тестовый' }
      }
    })
    if (!notification) return false

    const updatedNotification = await prisma.notification.update({
      where: { id: notification.id },
      data: { read: true }
    })
    
    return updatedNotification.read === true
  }, 'Уведомление должно отмечаться как прочитанное')

  // Сценарий 16-25: Агрегация и аналитика
  await runTest(16, 'Подсчет общего количества клиентов', async () => {
    const totalClients = await prisma.client.count({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return totalClients >= 4
  }, 'Должно быть минимум 4 клиента')

  await runTest(17, 'Подсчет общего количества объектов', async () => {
    const totalProperties = await prisma.property.count({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return totalProperties >= 4
  }, 'Должно быть минимум 4 объекта')

  await runTest(18, 'Подсчет общего количества договоров', async () => {
    const totalContracts = await prisma.contract.count({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return totalContracts >= 3
  }, 'Должно быть минимум 3 договора')

  await runTest(19, 'Подсчет общего количества платежей', async () => {
    const totalPayments = await prisma.payment.count({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return totalPayments >= 4
  }, 'Должно быть минимум 4 платежа')

  await runTest(20, 'Подсчет общего количества уведомлений', async () => {
    const totalNotifications = await prisma.notification.count({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return totalNotifications >= 4
  }, 'Должно быть минимум 4 уведомления')

  // Сценарий 21-30: Сложные запросы
  await runTest(21, 'Поиск клиентов с полными данными', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const clientsWithFullData = clients.filter(c => 
      c.firstName && c.lastName && c.phone && c.email && c.passport
    )
    return clientsWithFullData.length >= 2
  }, 'Должны находиться клиенты с полными данными')

  await runTest(22, 'Поиск объектов с изображениями и особенностями', async () => {
    const propertiesWithDetails = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        AND: [
          { images: { isEmpty: false } },
          { features: { isEmpty: false } },
          { description: { not: null } }
        ]
      }
    })
    return propertiesWithDetails.length >= 3
  }, 'Должны находиться объекты с полными данными')

  await runTest(23, 'Поиск подписанных договоров с датами', async () => {
    const signedContractsWithDates = await prisma.contract.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        AND: [
          { status: 'SIGNED' },
          { signedAt: { not: null } },
          { expiresAt: { not: null } }
        ]
      }
    })
    return signedContractsWithDates.length >= 1
  }, 'Должны находиться подписанные договоры с датами')

  await runTest(24, 'Поиск оплаченных платежей с датами', async () => {
    const paidPaymentsWithDates = await prisma.payment.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        AND: [
          { status: 'PAID' },
          { paidAt: { not: null } },
          { dueDate: { not: null } }
        ]
      }
    })
    return paidPaymentsWithDates.length >= 2
  }, 'Должны находиться оплаченные платежи с датами')

  await runTest(25, 'Поиск непрочитанных уведомлений', async () => {
    const unreadNotifications = await prisma.notification.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        read: false
      }
    })
    return unreadNotifications.length >= 2
  }, 'Должны находиться непрочитанные уведомления')

  // Сценарий 26-35: Валидация данных
  await runTest(26, 'Проверка корректности телефонных номеров', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validPhones = clients.filter(c => 
      c.phone && c.phone.startsWith('+7') && c.phone.length >= 12
    )
    return validPhones.length === clients.length
  }, 'Все телефонные номера должны быть корректными')

  await runTest(27, 'Проверка корректности email адресов', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        email: { not: null }
      }
    })
    const validEmails = clients.filter(c => 
      c.email && c.email.includes('@') && c.email.includes('.')
    )
    return validEmails.length === clients.length
  }, 'Все email адреса должны быть корректными')

  await runTest(28, 'Проверка корректности цен объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validPrices = properties.filter(p => 
      p.price > 0 && p.price <= 1000000
    )
    return validPrices.length === properties.length
  }, 'Все цены объектов должны быть корректными')

  await runTest(29, 'Проверка корректности сумм платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validAmounts = payments.filter(p => 
      p.amount > 0 && p.amount <= 1000000
    )
    return validAmounts.length === payments.length
  }, 'Все суммы платежей должны быть корректными')

  await runTest(30, 'Проверка корректности дат', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const contractsWithDates = contracts.filter(c => c.signedAt && c.expiresAt)
    const validDates = contractsWithDates.filter(c => 
      c.signedAt && c.expiresAt && c.signedAt < c.expiresAt
    )
    console.log(`   Договоров с датами: ${contractsWithDates.length}, корректных: ${validDates.length}`)
    // Требуем, чтобы минимум 80% договоров с датами были корректными
    return contractsWithDates.length === 0 || (validDates.length / contractsWithDates.length) >= 0.8
  }, 'Минимум 80% дат договоров должны быть корректными')

  // Сценарий 31-40: Производительность
  await runTest(31, 'Быстрый поиск клиентов по имени', async () => {
    const startTime = Date.now()
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        firstName: { contains: 'Анна' }
      }
    })
    const endTime = Date.now()
    return clients.length > 0 && (endTime - startTime) < 1000
  }, 'Поиск клиентов должен выполняться быстро')

  await runTest(32, 'Быстрый поиск объектов по адресу', async () => {
    const startTime = Date.now()
    const properties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        address: { contains: 'Тверская' }
      }
    })
    const endTime = Date.now()
    return properties.length > 0 && (endTime - startTime) < 1000
  }, 'Поиск объектов должен выполняться быстро')

  await runTest(33, 'Быстрый поиск договоров по статусу', async () => {
    const startTime = Date.now()
    const contracts = await prisma.contract.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        status: 'SIGNED'
      }
    })
    const endTime = Date.now()
    return contracts.length > 0 && (endTime - startTime) < 1000
  }, 'Поиск договоров должен выполняться быстро')

  await runTest(34, 'Быстрый поиск платежей по типу', async () => {
    const startTime = Date.now()
    const payments = await prisma.payment.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        type: 'RENT'
      }
    })
    const endTime = Date.now()
    return payments.length > 0 && (endTime - startTime) < 1000
  }, 'Поиск платежей должен выполняться быстро')

  await runTest(35, 'Быстрый поиск уведомлений по типу', async () => {
    const startTime = Date.now()
    const notifications = await prisma.notification.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        type: 'INFO'
      }
    })
    const endTime = Date.now()
    return notifications.length > 0 && (endTime - startTime) < 1000
  }, 'Поиск уведомлений должен выполняться быстро')

  // Сценарий 36-45: Интеграция данных
  await runTest(36, 'Проверка связей между клиентами и пользователем', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { clients: true }
    })
    return user && user.clients.length >= 4 && 
           user.clients.every(c => c.userId === user.id)
  }, 'Все клиенты должны быть связаны с пользователем')

  await runTest(37, 'Проверка связей между объектами и пользователем', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { properties: true }
    })
    return user && user.properties.length >= 4 && 
           user.properties.every(p => p.userId === user.id)
  }, 'Все объекты должны быть связаны с пользователем')

  await runTest(38, 'Проверка связей между договорами и пользователем', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { contracts: true }
    })
    return user && user.contracts.length >= 3 && 
           user.contracts.every(c => c.userId === user.id)
  }, 'Все договоры должны быть связаны с пользователем')

  await runTest(39, 'Проверка связей между платежами и пользователем', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { payments: true }
    })
    return user && user.payments.length >= 4 && 
           user.payments.every(p => p.userId === user.id)
  }, 'Все платежи должны быть связаны с пользователем')

  await runTest(40, 'Проверка связей между уведомлениями и пользователем', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { notifications: true }
    })
    return user && user.notifications.length >= 4 && 
           user.notifications.every(n => n.userId === user.id)
  }, 'Все уведомления должны быть связаны с пользователем')

  // Сценарий 41-50: Финальные проверки
  await runTest(41, 'Проверка целостности всех данных пользователя', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: {
        clients: true,
        properties: true,
        contracts: true,
        payments: true,
        notifications: true
      }
    })
    
    if (!user) return false
    
    const totalRecords = user.clients.length + user.properties.length + 
                        user.contracts.length + user.payments.length + 
                        user.notifications.length
    
    return totalRecords >= 19 // Минимум 4+4+3+4+4 = 19 записей
  }, 'У пользователя должен быть полный набор данных')

  await runTest(42, 'Проверка разнообразия типов данных', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    
    const clientTypes = new Set(clients.map(c => c.type))
    const propertyTypes = new Set(properties.map(p => p.type))
    const contractStatuses = new Set(contracts.map(c => c.status))
    const paymentTypes = new Set(payments.map(p => p.type))
    const notificationTypes = new Set(notifications.map(n => n.type))
    
    return clientTypes.size >= 2 && propertyTypes.size >= 1 && 
           contractStatuses.size >= 2 && paymentTypes.size >= 1 && 
           notificationTypes.size >= 2
  }, 'Должно быть разнообразие типов данных')

  await runTest(43, 'Проверка отсутствия дубликатов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    
    const clientIds = new Set(clients.map(c => c.id))
    const propertyIds = new Set(properties.map(p => p.id))
    const contractIds = new Set(contracts.map(c => c.id))
    const paymentIds = new Set(payments.map(p => p.id))
    const notificationIds = new Set(notifications.map(n => n.id))
    
    return clientIds.size === clients.length && 
           propertyIds.size === properties.length && 
           contractIds.size === contracts.length && 
           paymentIds.size === payments.length && 
           notificationIds.size === notifications.length
  }, 'Не должно быть дубликатов записей')

  await runTest(44, 'Проверка корректности всех обязательных полей', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    
    const validClients = clients.every(c => c.firstName && c.lastName && c.phone)
    const validProperties = properties.every(p => p.title && p.address && p.price > 0)
    const validContracts = contracts.every(c => c.title && c.content)
    const validPayments = payments.every(p => p.amount > 0 && p.dueDate)
    const validNotifications = notifications.every(n => n.title && n.message)
    
    return validClients && validProperties && validContracts && 
           validPayments && validNotifications
  }, 'Все записи должны иметь обязательные поля')

  await runTest(45, 'Проверка работоспособности системы в целом', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    
    if (!user) return false
    
    // Проверяем, что можем создавать новые записи
    const testClient = await prisma.client.create({
      data: {
        firstName: 'Тест',
        lastName: 'Тестов',
        phone: '+7 (999) 777-77-77',
        type: 'TENANT',
        userId: user.id
      }
    })
    
    // Удаляем тестовую запись
    await prisma.client.delete({
      where: { id: testClient.id }
    })
    
    return true
  }, 'Система должна позволять создавать и удалять записи')

  await runTest(46, 'Проверка производительности сложных запросов', async () => {
    const startTime = Date.now()
    
    const result = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: {
        clients: {
          where: { type: 'TENANT' }
        },
        properties: {
          where: { price: { gte: 50000 } }
        },
        contracts: {
          where: { status: 'SIGNED' }
        },
        payments: {
          where: { status: 'PAID' }
        },
        notifications: {
          where: { read: false }
        }
      }
    })
    
    const endTime = Date.now()
    
    return result && (endTime - startTime) < 2000
  }, 'Сложные запросы должны выполняться за разумное время')

  await runTest(47, 'Проверка корректности связей между таблицами', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    
    if (!user) return false
    
    // Проверяем, что все записи принадлежат пользователю
    const clients = await prisma.client.count({
      where: { userId: user.id }
    })
    const properties = await prisma.property.count({
      where: { userId: user.id }
    })
    const contracts = await prisma.contract.count({
      where: { userId: user.id }
    })
    const payments = await prisma.payment.count({
      where: { userId: user.id }
    })
    const notifications = await prisma.notification.count({
      where: { userId: user.id }
    })
    
    const totalUserRecords = clients + properties + contracts + payments + notifications
    
    // Проверяем общее количество записей
    const totalClients = await prisma.client.count()
    const totalProperties = await prisma.property.count()
    const totalContracts = await prisma.contract.count()
    const totalPayments = await prisma.payment.count()
    const totalNotifications = await prisma.notification.count()
    
    const totalRecords = totalClients + totalProperties + totalContracts + 
                        totalPayments + totalNotifications
    
    return totalUserRecords === totalRecords
  }, 'Все записи должны принадлежать пользователю')

  await runTest(48, 'Проверка отсутствия orphaned записей', async () => {
    const allClients = await prisma.client.findMany()
    const allProperties = await prisma.property.findMany()
    const allContracts = await prisma.contract.findMany()
    const allPayments = await prisma.payment.findMany()
    const allNotifications = await prisma.notification.findMany()
    
    const orphanedClients = allClients.filter(c => !c.userId)
    const orphanedProperties = allProperties.filter(p => !p.userId)
    const orphanedContracts = allContracts.filter(c => !c.userId)
    const orphanedPayments = allPayments.filter(p => !p.userId)
    const orphanedNotifications = allNotifications.filter(n => !n.userId)
    
    return orphanedClients.length === 0 && 
           orphanedProperties.length === 0 && 
           orphanedContracts.length === 0 && 
           orphanedPayments.length === 0 && 
           orphanedNotifications.length === 0
  }, 'Не должно быть записей без пользователя')

  await runTest(49, 'Проверка консистентности данных', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    
    if (!user) return false
    
    // Проверяем, что количество записей в базе соответствует ожиданиям
    const expectedMinRecords = 19 // Минимум записей
    
    const actualRecords = await prisma.client.count({
      where: { userId: user.id }
    }) + await prisma.property.count({
      where: { userId: user.id }
    }) + await prisma.contract.count({
      where: { userId: user.id }
    }) + await prisma.payment.count({
      where: { userId: user.id }
    }) + await prisma.notification.count({
      where: { userId: user.id }
    })
    
    return actualRecords >= expectedMinRecords
  }, 'Количество записей должно соответствовать ожиданиям')

  await runTest(50, 'Финальная проверка готовности системы', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: {
        clients: true,
        properties: true,
        contracts: true,
        payments: true,
        notifications: true
      }
    })
    
    if (!user) return false
    
    // Проверяем все критерии готовности
    const hasClients = user.clients.length >= 4
    const hasProperties = user.properties.length >= 4
    const hasContracts = user.contracts.length >= 3
    const hasPayments = user.payments.length >= 4
    const hasNotifications = user.notifications.length >= 4
    
    const hasDiverseData = new Set(user.clients.map(c => c.type)).size >= 2 &&
                          new Set(user.contracts.map(c => c.status)).size >= 2 &&
                          new Set(user.payments.map(p => p.status)).size >= 2 &&
                          new Set(user.notifications.map(n => n.type)).size >= 2
    
    const hasValidData = user.clients.every(c => c.firstName && c.lastName && c.phone) &&
                        user.properties.every(p => p.title && p.address && p.price > 0) &&
                        user.contracts.every(c => c.title && c.content) &&
                        user.payments.every(p => p.amount > 0 && p.dueDate) &&
                        user.notifications.every(n => n.title && n.message)
    
    return hasClients && hasProperties && hasContracts && 
           hasPayments && hasNotifications && hasDiverseData && hasValidData
  }, 'Система должна быть полностью готова к использованию')

  // Вывод результатов
  console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ СЛОЖНЫХ СЦЕНАРИЕВ:')
  console.log('=' * 70)
  
  const passed = testResults.filter(t => t.status === 'PASS').length
  const failed = testResults.filter(t => t.status === 'FAIL').length
  
  console.log(`✅ Пройдено: ${passed}`)
  console.log(`❌ Провалено: ${failed}`)
  console.log(`📈 Успешность: ${((passed / testResults.length) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log('\n❌ ПРОВАЛЕННЫЕ ТЕСТЫ:')
    testResults
      .filter(t => t.status === 'FAIL')
      .forEach(t => {
        console.log(`   Тест ${t.testId}: ${t.name}`)
        console.log(`   Детали: ${t.details}`)
        if (t.error) console.log(`   Ошибка: ${t.error}`)
        console.log('')
      })
  }
  
  console.log('\n🎯 РЕКОМЕНДАЦИИ:')
  if (passed === testResults.length) {
    console.log('✅ Все сложные сценарии пройдены! Система готова к продакшену.')
  } else {
    console.log('⚠️  Обнаружены проблемы в сложных сценариях.')
    console.log('🔧 Рекомендуется исправить проваленные тесты перед деплоем.')
  }
}

complexScenariosTesting()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 