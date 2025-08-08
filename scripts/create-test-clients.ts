import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestClients() {
  try {
    console.log('Creating test clients...')
    
    // Найдем пользователя
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('No users found in database')
      return
    }
    
    console.log('Found user:', user.email)
    
    // Создаем арендатора
    const tenant = await prisma.client.create({
      data: {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        type: 'TENANT',
        userId: user.id
      }
    })
    
    console.log('Created tenant:', tenant)
    
    // Создаем арендодателя
    const landlord = await prisma.client.create({
      data: {
        firstName: 'Петр',
        lastName: 'Петров',
        email: 'petr@example.com',
        phone: '+7 (999) 987-65-43',
        type: 'LANDLORD',
        userId: user.id
      }
    })
    
    console.log('Created landlord:', landlord)
    
    console.log('Test clients created successfully!')
    
  } catch (error) {
    console.error('Error creating test clients:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestClients() 