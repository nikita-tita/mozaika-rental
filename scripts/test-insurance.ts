import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testInsuranceSystem() {
  console.log('🧪 Тестирование системы страхования...\n')

  try {
    // 1. Создаем тестового пользователя
    console.log('1. Создание тестового пользователя...')
    const user = await prisma.user.upsert({
      where: { email: 'test-insurance@example.com' },
      update: {},
      create: {
        email: 'test-insurance@example.com',
        password: 'hashedpassword',
        firstName: 'Тест',
        lastName: 'Страхование',
        role: 'REALTOR'
      }
    })
    console.log(`✅ Пользователь создан: ${user.firstName} ${user.lastName}`)

    // 2. Создаем тестовый объект недвижимости
    console.log('\n2. Создание тестового объекта недвижимости...')
    const property = await prisma.property.create({
      data: {
        title: 'Тестовая квартира для страхования',
        description: 'Квартира для тестирования системы страхования',
        type: 'APARTMENT',
        address: 'ул. Тестовая, д. 1, кв. 1',
        area: 50.5,
        bedrooms: 2,
        bathrooms: 1,
        price: 50000,
        features: ['Балкон', 'Лоджия'],
        images: [],
        userId: user.id
      }
    })
    console.log(`✅ Объект создан: ${property.title}`)

    // 3. Создаем несколько страховых полисов
    console.log('\n3. Создание страховых полисов...')
    
    const policies = [
      {
        type: 'PROPERTY',
        insuredAmount: 2000000,
        deductible: 100000,
        premium: 30000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
        insuranceCompany: 'Росгосстрах',
        propertyId: property.id
      },
      {
        type: 'LIABILITY',
        insuredAmount: 1000000,
        deductible: 50000,
        premium: 15000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней (истекает скоро)
        insuranceCompany: 'АльфаСтрахование',
        propertyId: property.id
      },
      {
        type: 'COMPREHENSIVE',
        insuredAmount: 5000000,
        deductible: 200000,
        premium: 75000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 месяцев
        insuranceCompany: 'Сбербанк Страхование',
        propertyId: property.id
      }
    ]

    const createdPolicies = []
    for (const policyData of policies) {
      const policyNumber = `POL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      const policy = await prisma.insurancePolicy.create({
        data: {
          policyNumber,
          ...policyData,
          userId: user.id
        }
      })
      createdPolicies.push(policy)
      console.log(`✅ Полис создан: ${policy.policyNumber} (${policy.type})`)
    }

    // 4. Оплачиваем один полис
    console.log('\n4. Оплата полиса...')
    const policyToPay = createdPolicies[0]
    const payment = await prisma.insurancePayment.create({
      data: {
        amount: policyToPay.premium,
        status: 'PAID',
        paymentMethod: 'CARD',
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date(),
        policyId: policyToPay.id
      }
    })

    await prisma.insurancePolicy.update({
      where: { id: policyToPay.id },
      data: { status: 'ACTIVE' }
    })

    console.log(`✅ Полис ${policyToPay.policyNumber} оплачен и активирован`)

    // 5. Создаем уведомления об истечении
    console.log('\n5. Создание уведомлений об истечении...')
    const expiringPolicy = createdPolicies[1] // Второй полис истекает через 30 дней
    const daysUntilExpiry = Math.ceil(
      (new Date(expiringPolicy.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    const notification = await prisma.notification.create({
      data: {
        title: 'Полис страхования истекает',
        message: `Полис ${expiringPolicy.policyNumber} истекает через ${daysUntilExpiry} дней. Рекомендуем продлить страхование.`,
        type: 'WARNING',
        userId: user.id,
        policyId: expiringPolicy.id
      }
    })
    console.log(`✅ Уведомление создано для полиса ${expiringPolicy.policyNumber}`)

    // 6. Создаем страховой случай
    console.log('\n6. Создание страхового случая...')
    const claim = await prisma.insuranceClaim.create({
      data: {
        claimNumber: `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        description: 'Затопление квартиры соседями',
        amount: 150000,
        status: 'SUBMITTED',
        incidentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
        policyId: policyToPay.id
      }
    })
    console.log(`✅ Страховой случай создан: ${claim.claimNumber}`)

    // 7. Выводим статистику
    console.log('\n7. Статистика системы страхования:')
    
    const allPolicies = await prisma.insurancePolicy.findMany({
      where: { userId: user.id },
      include: {
        property: true,
        payments: true,
        claims: true
      }
    })

    console.log(`📊 Всего полисов: ${allPolicies.length}`)
    console.log(`📊 Активных полисов: ${allPolicies.filter(p => p.status === 'ACTIVE').length}`)
    console.log(`📊 Черновиков: ${allPolicies.filter(p => p.status === 'DRAFT').length}`)
    console.log(`📊 Истекающих полисов: ${allPolicies.filter(p => {
      const days = Math.ceil((new Date(p.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return days <= 30 && days > 0
    }).length}`)
    
    const totalPremium = allPolicies.reduce((sum, p) => sum + p.premium, 0)
    console.log(`💰 Общая премия: ${totalPremium.toLocaleString('ru-RU')} ₽`)

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id }
    })
    console.log(`🔔 Уведомлений: ${notifications.length}`)

    console.log('\n✅ Тестирование системы страхования завершено успешно!')
    console.log('\n📋 Созданные данные:')
    console.log(`👤 Пользователь: ${user.email}`)
    console.log(`🏠 Объект: ${property.title}`)
    console.log(`📄 Полисы: ${allPolicies.map(p => p.policyNumber).join(', ')}`)
    console.log(`💳 Платежи: ${payment.transactionId}`)
    console.log(`📋 Страховой случай: ${claim.claimNumber}`)

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testInsuranceSystem() 