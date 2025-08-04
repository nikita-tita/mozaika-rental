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

async function interfaceTesting() {
  console.log('🚀 Начинаю тестирование интерфейса и связей данных...\n')

  // Тесты 1-10: Проверка связей между данными
  await runTest(1, 'Проверка связи клиент-пользователь', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { clients: true }
    })
    return user && user.clients.length > 0 && user.clients.every(c => c.userId === user.id)
  }, 'Все клиенты должны быть связаны с пользователем')

  await runTest(2, 'Проверка связи объект-пользователь', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { properties: true }
    })
    return user && user.properties.length > 0 && user.properties.every(p => p.userId === user.id)
  }, 'Все объекты должны быть связаны с пользователем')

  await runTest(3, 'Проверка связи договор-пользователь', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { contracts: true }
    })
    return user && user.contracts.length > 0 && user.contracts.every(c => c.userId === user.id)
  }, 'Все договоры должны быть связаны с пользователем')

  await runTest(4, 'Проверка связи платеж-пользователь', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { payments: true }
    })
    return user && user.payments.length > 0 && user.payments.every(p => p.userId === user.id)
  }, 'Все платежи должны быть связаны с пользователем')

  await runTest(5, 'Проверка связи уведомление-пользователь', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'nikitatitov070@gmail.com' },
      include: { notifications: true }
    })
    return user && user.notifications.length > 0 && user.notifications.every(n => n.userId === user.id)
  }, 'Все уведомления должны быть связаны с пользователем')

  // Тесты 6-15: Проверка целостности данных клиентов
  await runTest(6, 'Проверка обязательных полей клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return clients.every(c => c.firstName && c.lastName && c.phone)
  }, 'Все клиенты должны иметь имя, фамилию и телефон')

  await runTest(7, 'Проверка типов клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const types = new Set(clients.map(c => c.type))
    return types.has('TENANT') && types.has('LANDLORD')
  }, 'Должны быть клиенты типа TENANT и LANDLORD')

  await runTest(8, 'Проверка уникальности данных клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const phones = clients.map(c => c.phone)
    const uniquePhones = new Set(phones)
    return phones.length === uniquePhones.size
  }, 'Телефоны клиентов должны быть уникальными')

  await runTest(9, 'Проверка корректности email клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        email: { not: null }
      }
    })
    return clients.every(c => c.email && c.email.includes('@'))
  }, 'Email клиентов должны быть корректными')

  await runTest(10, 'Проверка активности клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return clients.every(c => c.isActive === true)
  }, 'Все клиенты должны быть активными')

  // Тесты 11-20: Проверка целостности данных объектов
  await runTest(11, 'Проверка обязательных полей объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => p.title && p.address && p.price > 0)
  }, 'Все объекты должны иметь название, адрес и цену')

  await runTest(12, 'Проверка типов объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => ['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND'].includes(p.type))
  }, 'Все объекты должны иметь валидный тип')

  await runTest(13, 'Проверка уникальности адресов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const addresses = properties.map(p => p.address)
    const uniqueAddresses = new Set(addresses)
    return addresses.length === uniqueAddresses.size
  }, 'Адреса объектов должны быть уникальными')

  await runTest(14, 'Проверка наличия изображений', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => p.images.length > 0)
  }, 'Все объекты должны иметь изображения')

  await runTest(15, 'Проверка наличия особенностей', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => p.features.length > 0)
  }, 'Все объекты должны иметь особенности')

  // Тесты 16-25: Проверка целостности данных договоров
  await runTest(16, 'Проверка обязательных полей договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return contracts.every(c => c.title && c.content)
  }, 'Все договоры должны иметь название и содержание')

  await runTest(17, 'Проверка статусов договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return contracts.every(c => ['DRAFT', 'SIGNED', 'EXPIRED', 'TERMINATED'].includes(c.status))
  }, 'Все договоры должны иметь валидный статус')

  await runTest(18, 'Проверка дат договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        signedAt: { not: null },
        expiresAt: { not: null }
      }
    })
    return contracts.every(c => c.signedAt && c.expiresAt && c.signedAt < c.expiresAt)
  }, 'Дата подписания должна быть раньше даты истечения')

  await runTest(19, 'Проверка уникальности названий договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const titles = contracts.map(c => c.title)
    const uniqueTitles = new Set(titles)
    return titles.length === uniqueTitles.size
  }, 'Названия договоров должны быть уникальными')

  await runTest(20, 'Проверка разнообразия статусов договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const statuses = new Set(contracts.map(c => c.status))
    return statuses.size >= 2
  }, 'Должны быть договоры разных статусов')

  // Тесты 21-30: Проверка целостности данных платежей
  await runTest(21, 'Проверка обязательных полей платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => p.amount > 0 && p.dueDate)
  }, 'Все платежи должны иметь сумму и дату платежа')

  await runTest(22, 'Проверка типов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => ['RENT', 'DEPOSIT', 'UTILITIES', 'MAINTENANCE'].includes(p.type))
  }, 'Все платежи должны иметь валидный тип')

  await runTest(23, 'Проверка статусов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].includes(p.status))
  }, 'Все платежи должны иметь валидный статус')

  await runTest(24, 'Проверка дат платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        paidAt: { not: null }
      }
    })
    return payments.every(p => p.dueDate && p.paidAt && p.paidAt >= p.dueDate)
  }, 'Дата оплаты должна быть не раньше даты платежа')

  await runTest(25, 'Проверка разнообразия статусов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const statuses = new Set(payments.map(p => p.status))
    return statuses.size >= 2
  }, 'Должны быть платежи разных статусов')

  // Тесты 26-35: Проверка целостности данных уведомлений
  await runTest(26, 'Проверка обязательных полей уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return notifications.every(n => n.title && n.message)
  }, 'Все уведомления должны иметь заголовок и сообщение')

  await runTest(27, 'Проверка типов уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return notifications.every(n => ['INFO', 'WARNING', 'ERROR', 'SUCCESS'].includes(n.type))
  }, 'Все уведомления должны иметь валидный тип')

  await runTest(28, 'Проверка статуса прочтения уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const hasRead = notifications.some(n => n.read === true)
    const hasUnread = notifications.some(n => n.read === false)
    return hasRead && hasUnread
  }, 'Должны быть прочитанные и непрочитанные уведомления')

  await runTest(29, 'Проверка уникальности уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const titles = notifications.map(n => n.title)
    const uniqueTitles = new Set(titles)
    return titles.length === uniqueTitles.size
  }, 'Заголовки уведомлений должны быть уникальными')

  await runTest(30, 'Проверка разнообразия типов уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const types = new Set(notifications.map(n => n.type))
    return types.size >= 2
  }, 'Должны быть уведомления разных типов')

  // Тесты 31-40: Проверка бизнес-логики
  await runTest(31, 'Проверка корректности цен объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return properties.every(p => p.price >= 10000 && p.price <= 500000)
  }, 'Цены объектов должны быть в разумных пределах')

  await runTest(32, 'Проверка корректности площадей', async () => {
    const properties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        area: { not: null }
      }
    })
    return properties.every(p => p.area! > 0 && p.area! <= 1000)
  }, 'Площади объектов должны быть корректными')

  await runTest(33, 'Проверка корректности количества комнат', async () => {
    const properties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        bedrooms: { not: null }
      }
    })
    return properties.every(p => p.bedrooms! >= 0 && p.bedrooms! <= 10)
  }, 'Количество спален должно быть корректным')

  await runTest(34, 'Проверка корректности дат рождения клиентов', async () => {
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

  await runTest(35, 'Проверка корректности сумм платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return payments.every(p => p.amount >= 1000 && p.amount <= 500000)
  }, 'Суммы платежей должны быть в разумных пределах')

  // Тесты 36-45: Проверка связей между сущностями
  await runTest(36, 'Проверка отсутствия дубликатов клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const uniqueCombinations = new Set(
      clients.map(c => `${c.firstName}-${c.lastName}-${c.phone}`)
    )
    return uniqueCombinations.size === clients.length
  }, 'Не должно быть дубликатов клиентов')

  await runTest(37, 'Проверка отсутствия дубликатов объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const uniqueCombinations = new Set(
      properties.map(p => `${p.title}-${p.address}`)
    )
    return uniqueCombinations.size === properties.length
  }, 'Не должно быть дубликатов объектов')

  await runTest(38, 'Проверка отсутствия дубликатов договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const uniqueTitles = new Set(contracts.map(c => c.title))
    return uniqueTitles.size === contracts.length
  }, 'Не должно быть дубликатов договоров')

  await runTest(39, 'Проверка отсутствия дубликатов платежей', async () => {
    const payments = await prisma.payment.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const uniqueCombinations = new Set(
      payments.map(p => `${p.amount}-${p.dueDate?.toISOString()}-${p.type}`)
    )
    return uniqueCombinations.size === payments.length
  }, 'Не должно быть дубликатов платежей')

  await runTest(40, 'Проверка отсутствия дубликатов уведомлений', async () => {
    const notifications = await prisma.notification.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    const uniqueCombinations = new Set(
      notifications.map(n => `${n.title}-${n.message}`)
    )
    return uniqueCombinations.size === notifications.length
  }, 'Не должно быть дубликатов уведомлений')

  // Тесты 41-50: Дополнительные проверки
  await runTest(41, 'Проверка корректности паспортных данных', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        passport: { not: null }
      }
    })
    return clients.every(c => c.passport && c.passport.length >= 10)
  }, 'Паспортные данные должны быть корректными')

  await runTest(42, 'Проверка корректности СНИЛС', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        snils: { not: null }
      }
    })
    return clients.every(c => c.snils && c.snils.includes('-'))
  }, 'СНИЛС должен быть в корректном формате')

  await runTest(43, 'Проверка корректности ИНН', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        inn: { not: null }
      }
    })
    return clients.every(c => c.inn && c.inn.length === 12)
  }, 'ИНН должен быть 12-значным')

  await runTest(44, 'Проверка корректности адресов', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        address: { not: null }
      }
    })
    return clients.every(c => c.address && c.address.includes('г. Москва'))
  }, 'Адреса должны содержать город')

  await runTest(45, 'Проверка корректности городов', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        city: { not: null }
      }
    })
    return clients.every(c => c.city === 'Москва')
  }, 'Все клиенты должны быть из Москвы')

  await runTest(46, 'Проверка корректности источников клиентов', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        source: { not: null }
      }
    })
    const validSources = ['Сайт', 'Рекомендация', 'Avito', 'Яндекс.Недвижимость']
    return clients.every(c => c.source && validSources.includes(c.source))
  }, 'Источники клиентов должны быть валидными')

  await runTest(47, 'Проверка корректности заметок', async () => {
    const clients = await prisma.client.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        notes: { not: null }
      }
    })
    return clients.every(c => c.notes && c.notes.length > 0)
  }, 'Заметки должны быть непустыми')

  await runTest(48, 'Проверка корректности описаний объектов', async () => {
    const properties = await prisma.property.findMany({
      where: { 
        user: { email: 'nikitatitov070@gmail.com' },
        description: { not: null }
      }
    })
    return properties.every(p => p.description && p.description.length > 10)
  }, 'Описания объектов должны быть информативными')

  await runTest(49, 'Проверка корректности содержания договоров', async () => {
    const contracts = await prisma.contract.findMany({
      where: { user: { email: 'nikitatitov070@gmail.com' } }
    })
    return contracts.every(c => c.content && c.content.length > 20)
  }, 'Содержание договоров должно быть подробным')

  await runTest(50, 'Проверка общей целостности системы', async () => {
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
    
    const hasData = user.clients.length > 0 && user.properties.length > 0 && 
                   user.contracts.length > 0 && user.payments.length > 0 && 
                   user.notifications.length > 0
    
    return totalRecords >= 14 && hasData
  }, 'Система должна содержать полный набор связанных данных')

  // Вывод результатов
  console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ИНТЕРФЕЙСА:')
  console.log('=' * 60)
  
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
    console.log('✅ Все тесты пройдены! Интерфейс и связи данных работают корректно.')
  } else {
    console.log('⚠️  Обнаружены проблемы, требующие исправления.')
    console.log('🔧 Рекомендуется проверить и исправить проваленные тесты.')
  }
}

interfaceTesting()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 