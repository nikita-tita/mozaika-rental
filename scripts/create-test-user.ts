import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // Проверяем, существует ли уже пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (existingUser) {
      console.log('User already exists, updating password...')
      
      const hashedPassword = await hashPassword('password123')
      
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: {
          password: hashedPassword,
          verified: true
        }
      })
      
      console.log('Password updated successfully!')
      return
    }
    
    // Создаем нового пользователя
    const hashedPassword = await hashPassword('password123')
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Тестовый',
        lastName: 'Пользователь',
        role: 'REALTOR',
        verified: true
      }
    })
    
    console.log('Test user created successfully:', user.email)
    
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 