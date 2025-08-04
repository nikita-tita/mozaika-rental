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

async function comprehensiveTesting() {
  console.log('🚀 Начинаю комплексное тестирование системы...\n')

  // Тесты 1-10: Проверка пользователей и авторизации
  await runTest(1, 'Проверка существования пользователя nikitatitov070@gmail.com', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' }
    })
    return user !== null && user.role === 'REALTOR'
  }, 'Пользователь должен существовать и иметь роль REALTOR')

  await runTest(2, 'Проверка количества клиентов у пользователя', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return clients.length >= 3
  }, 'У пользователя должно быть минимум 3 клиента')

  await runTest(3, 'Проверка типов клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const hasTenant = clients.some(c => c.type === 'TENANT')
    const hasLandlord = clients.some(c => c.type === 'LANDLORD')
    return hasTenant && hasLandlord
  }, 'Должны быть клиенты типа TENANT и LANDLORD')

  await runTest(4, 'Проверка обязательных полей клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return clients.every(c => c.firstName && c.lastName && c.phone)
  }, 'Все клиенты должны иметь имя, фамилию и телефон')

  await runTest(5, 'Проверка уникальности email клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const emails = clients.map(c => c.email).filter(Boolean)
    const uniqueEmails = new Set(emails)
    return emails.length === uniqueEmails.size || emails.length === 0
  }, 'Email клиентов должны быть уникальными (если указаны)')

  // Тесты 6-15: Проверка объектов недвижимости
  await runTest(6, 'Проверка количества объектов недвижимости', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.length >= 3
  }, 'У пользователя должно быть минимум 3 объекта недвижимости')

  await runTest(7, 'Проверка типов недвижимости', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => ['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND'].includes(p.type))
  }, 'Все объекты должны иметь валидный тип')

  await runTest(8, 'Проверка обязательных полей объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => p.title && p.address && p.price > 0)
  }, 'Все объекты должны иметь название, адрес и цену')

  await runTest(9, 'Проверка уникальности адресов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const addresses = properties.map(p => p.address)
    const uniqueAddresses = new Set(addresses)
    return addresses.length === uniqueAddresses.size
  }, 'Адреса объектов должны быть уникальными')

  await runTest(10, 'Проверка корректности цен', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => p.price >= 0 && p.price <= 1000000)
  }, 'Цены должны быть в разумных пределах')

  // Тесты 11-20: Проверка договоров
  await runTest(11, 'Проверка количества договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return contracts.length >= 2
  }, 'У пользователя должно быть минимум 2 договора')

  await runTest(12, 'Проверка статусов договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return contracts.every(c => ['DRAFT', 'SIGNED', 'EXPIRED', 'TERMINATED'].includes(c.status))
  }, 'Все договоры должны иметь валидный статус')

  await runTest(13, 'Проверка обязательных полей договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return contracts.every(c => c.title && c.content)
  }, 'Все договоры должны иметь название и содержание')

  await runTest(14, 'Проверка дат договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        signedAt: { not: null },
        expiresAt: { not: null }
      }
    })
    return contracts.every(c => c.signedAt && c.expiresAt && c.signedAt < c.expiresAt)
  }, 'Дата подписания должна быть раньше даты истечения')

  await runTest(15, 'Проверка уникальности названий договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const titles = contracts.map(c => c.title)
    const uniqueTitles = new Set(titles)
    return titles.length === uniqueTitles.size
  }, 'Названия договоров должны быть уникальными')

  // Тесты 16-25: Проверка платежей
  await runTest(16, 'Проверка количества платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.length >= 3
  }, 'У пользователя должно быть минимум 3 платежа')

  await runTest(17, 'Проверка типов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => ['RENT', 'DEPOSIT', 'UTILITIES', 'MAINTENANCE'].includes(p.type))
  }, 'Все платежи должны иметь валидный тип')

  await runTest(18, 'Проверка статусов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].includes(p.status))
  }, 'Все платежи должны иметь валидный статус')

  await runTest(19, 'Проверка корректности сумм платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => p.amount > 0 && p.amount <= 1000000)
  }, 'Суммы платежей должны быть положительными и разумными')

  await runTest(20, 'Проверка дат платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        paidAt: { not: null }
      }
    })
    return payments.every(p => p.dueDate && p.paidAt && p.paidAt >= p.dueDate)
  }, 'Дата оплаты должна быть не раньше даты платежа')

  // Тесты 21-30: Проверка уведомлений
  await runTest(21, 'Проверка количества уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return notifications.length >= 3
  }, 'У пользователя должно быть минимум 3 уведомления')

  await runTest(22, 'Проверка типов уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return notifications.every(n => ['INFO', 'WARNING', 'ERROR', 'SUCCESS'].includes(n.type))
  }, 'Все уведомления должны иметь валидный тип')

  await runTest(23, 'Проверка обязательных полей уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return notifications.every(n => n.title && n.message)
  }, 'Все уведомления должны иметь заголовок и сообщение')

  await runTest(24, 'Проверка статуса прочтения уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const hasRead = notifications.some(n => n.read === true)
    const hasUnread = notifications.some(n => n.read === false)
    return hasRead && hasUnread
  }, 'Должны быть прочитанные и непрочитанные уведомления')

  await runTest(25, 'Проверка уникальности уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const titles = notifications.map(n => n.title)
    const uniqueTitles = new Set(titles)
    return titles.length === uniqueTitles.size
  }, 'Заголовки уведомлений должны быть уникальными')

  // Тесты 26-35: Проверка связей между данными
  await runTest(26, 'Проверка связи пользователь-клиенты', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { clients: true }
    })
    return user && user.clients.length > 0
  }, 'Пользователь должен быть связан с клиентами')

  await runTest(27, 'Проверка связи пользователь-объекты', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { properties: true }
    })
    return user && user.properties.length > 0
  }, 'Пользователь должен быть связан с объектами недвижимости')

  await runTest(28, 'Проверка связи пользователь-договоры', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { contracts: true }
    })
    return user && user.contracts.length > 0
  }, 'Пользователь должен быть связан с договорами')

  await runTest(29, 'Проверка связи пользователь-платежи', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { payments: true }
    })
    return user && user.payments.length > 0
  }, 'Пользователь должен быть связан с платежами')

  await runTest(30, 'Проверка связи пользователь-уведомления', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { notifications: true }
    })
    return user && user.notifications.length > 0
  }, 'Пользователь должен быть связан с уведомлениями')

  // Тесты 31-40: Проверка целостности данных
  await runTest(31, 'Проверка отсутствия клиентов без пользователя', async () => {
    const allClients = await prisma.client.findMany()
    const orphanedClients = allClients.filter(c => !c.userId)
    return orphanedClients.length === 0
  }, 'Не должно быть клиентов без пользователя')

  await runTest(32, 'Проверка отсутствия объектов без пользователя', async () => {
    const allProperties = await prisma.property.findMany()
    const orphanedProperties = allProperties.filter(p => !p.userId)
    return orphanedProperties.length === 0
  }, 'Не должно быть объектов без пользователя')

  await runTest(33, 'Проверка отсутствия договоров без пользователя', async () => {
    const allContracts = await prisma.contract.findMany()
    const orphanedContracts = allContracts.filter(c => !c.userId)
    return orphanedContracts.length === 0
  }, 'Не должно быть договоров без пользователя')

  await runTest(34, 'Проверка отсутствия платежей без пользователя', async () => {
    const allPayments = await prisma.payment.findMany()
    const orphanedPayments = allPayments.filter(p => !p.userId)
    return orphanedPayments.length === 0
  }, 'Не должно быть платежей без пользователя')

  await runTest(35, 'Проверка отсутствия уведомлений без пользователя', async () => {
    const allNotifications = await prisma.notification.findMany()
    const orphanedNotifications = allNotifications.filter(n => !n.userId)
    return orphanedNotifications.length === 0
  }, 'Не должно быть уведомлений без пользователя')

  // Тесты 36-45: Проверка бизнес-логики
  await runTest(36, 'Проверка корректности данных клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validClients = clients.filter(c => 
      c.firstName.length > 0 && 
      c.lastName.length > 0 && 
      c.phone.length >= 10
    )
    return validClients.length === clients.length
  }, 'Все клиенты должны иметь корректные данные')

  await runTest(37, 'Проверка корректности данных объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validProperties = properties.filter(p => 
      p.title.length > 0 && 
      p.address.length > 0 && 
      p.price > 0
    )
    return validProperties.length === properties.length
  }, 'Все объекты должны иметь корректные данные')

  await runTest(38, 'Проверка корректности данных договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validContracts = contracts.filter(c => 
      c.title.length > 0 && 
      c.content.length > 0
    )
    return validContracts.length === contracts.length
  }, 'Все договоры должны иметь корректные данные')

  await runTest(39, 'Проверка корректности данных платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validPayments = payments.filter(p => 
      p.amount > 0 && 
      p.dueDate
    )
    return validPayments.length === payments.length
  }, 'Все платежи должны иметь корректные данные')

  await runTest(40, 'Проверка корректности данных уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const validNotifications = notifications.filter(n => 
      n.title.length > 0 && 
      n.message.length > 0
    )
    return validNotifications.length === notifications.length
  }, 'Все уведомления должны иметь корректные данные')

  // Тесты 41-50: Дополнительные проверки
  await runTest(41, 'Проверка разнообразия типов клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const types = new Set(clients.map(c => c.type))
    return types.size >= 2
  }, 'Должны быть клиенты разных типов')

  await runTest(42, 'Проверка разнообразия статусов договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const statuses = new Set(contracts.map(c => c.status))
    return statuses.size >= 2
  }, 'Должны быть договоры разных статусов')

  await runTest(43, 'Проверка разнообразия статусов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const statuses = new Set(payments.map(p => p.status))
    return statuses.size >= 2
  }, 'Должны быть платежи разных статусов')

  await runTest(44, 'Проверка разнообразия типов уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const types = new Set(notifications.map(n => n.type))
    return types.size >= 2
  }, 'Должны быть уведомления разных типов')

  await runTest(45, 'Проверка наличия изображений у объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const propertiesWithImages = properties.filter(p => p.images.length > 0)
    return propertiesWithImages.length > 0
  }, 'Хотя бы у одного объекта должны быть изображения')

  await runTest(46, 'Проверка наличия особенностей у объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const propertiesWithFeatures = properties.filter(p => p.features.length > 0)
    return propertiesWithFeatures.length > 0
  }, 'Хотя бы у одного объекта должны быть особенности')

  await runTest(47, 'Проверка корректности дат рождения клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        birthDate: { not: null }
      }
    })
    const validDates = clients.filter(c => {
      const age = new Date().getFullYear() - c.birthDate!.getFullYear()
      return age >= 18 && age <= 100
    })
    return validDates.length === clients.length
  }, 'Даты рождения клиентов должны быть корректными')

  await runTest(48, 'Проверка корректности площадей объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        area: { not: null }
      }
    })
    const validAreas = properties.filter(p => p.area! > 0 && p.area! <= 1000)
    return validAreas.length === properties.length
  }, 'Площади объектов должны быть корректными')

  await runTest(49, 'Проверка корректности количества комнат', async () => {
    const properties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        bedrooms: { not: null }
      }
    })
    const validBedrooms = properties.filter(p => p.bedrooms! >= 0 && p.bedrooms! <= 10)
    return validBedrooms.length === properties.length
  }, 'Количество спален должно быть корректным')

  await runTest(50, 'Проверка общей целостности данных', async () => {
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
    
    return totalRecords >= 14 // Минимум 3+3+2+3+3 = 14 записей
  }, 'Общее количество записей должно соответствовать ожиданиям')

  // Вывод результатов
  console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:')
  console.log('=' * 50)
  
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
    console.log('✅ Все тесты пройдены! Система работает корректно.')
  } else {
    console.log('⚠️  Обнаружены проблемы, требующие исправления.')
    console.log('🔧 Рекомендуется проверить и исправить проваленные тесты.')
  }
}

comprehensiveTesting()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 