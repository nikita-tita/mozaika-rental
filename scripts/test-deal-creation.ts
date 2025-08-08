import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDealCreation() {
  try {
    console.log('Testing deal creation...')
    
    // Сначала найдем пользователя
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('No users found in database')
      return
    }
    
    console.log('Found user:', user.email)
    
    // Найдем объект недвижимости
    const property = await prisma.property.findFirst({
      where: { userId: user.id }
    })
    if (!property) {
      console.log('No properties found for user')
      return
    }
    
    console.log('Found property:', property.title)
    
    // Найдем клиентов
    const clients = await prisma.client.findMany({
      where: { userId: user.id },
      take: 2
    })
    
    if (clients.length < 2) {
      console.log('Need at least 2 clients (tenant and landlord)')
      return
    }
    
    const tenant = clients[0]
    const landlord = clients[1]
    
    console.log('Found tenant:', tenant.firstName, tenant.lastName)
    console.log('Found landlord:', landlord.firstName, landlord.lastName)
    
    // Создаем тестовую сделку
    const deal = await prisma.deal.create({
      data: {
        title: 'Тестовая сделка',
        description: 'Описание тестовой сделки',
        status: 'IN_PROGRESS',
        monthlyRent: 50000,
        deposit: 100000,
        commission: 25000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-01'),
        propertyId: property.id,
        tenantId: tenant.id,
        landlordId: landlord.id,
        userId: user.id
      },
      include: {
        property: true,
        tenant: true,
        landlord: true
      }
    })
    
    console.log('Deal created successfully:', deal)
    
  } catch (error) {
    console.error('Error creating deal:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDealCreation() 