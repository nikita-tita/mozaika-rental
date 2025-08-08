const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabaseData() {
  try {
    console.log('🔍 Проверка данных в базе данных...\n')

    // Проверяем пользователей
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verified: true,
        createdAt: true
      }
    })
    
    console.log(`👥 Пользователи (${users.length}):`)
    users.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`)
    })

    // Проверяем клиентов
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        type: true,
        createdAt: true
      }
    })
    
    console.log(`\n👤 Клиенты (${clients.length}):`)
    clients.forEach(client => {
      console.log(`  - ${client.firstName} ${client.lastName} (${client.phone}) - ${client.type}`)
    })

    // Проверяем объекты недвижимости
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        address: true,
        price: true,
        status: true,
        createdAt: true
      }
    })
    
    console.log(`\n🏠 Объекты недвижимости (${properties.length}):`)
    properties.forEach(property => {
      console.log(`  - ${property.title} (${property.type}) - ${property.price}₽ - ${property.status}`)
    })

    // Проверяем контракты
    const contracts = await prisma.contract.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true
      }
    })
    
    console.log(`\n📄 Контракты (${contracts.length}):`)
    contracts.forEach(contract => {
      console.log(`  - ${contract.title} - ${contract.status}`)
    })

    // Проверяем сделки
    const deals = await prisma.deal.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        amount: true,
        createdAt: true
      }
    })
    
    console.log(`\n💰 Сделки (${deals.length}):`)
    deals.forEach(deal => {
      console.log(`  - ${deal.title} - ${deal.amount}₽ - ${deal.status}`)
    })

    console.log('\n✅ Проверка завершена!')
    
  } catch (error) {
    console.error('❌ Ошибка при проверке данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
checkDatabaseData()
  .then(() => {
    console.log('\n🎯 Скрипт завершен')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Критическая ошибка:', error)
    process.exit(1)
  }) 