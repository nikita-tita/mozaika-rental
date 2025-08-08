import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface TestResult {
  scenario: string
  success: boolean
  error?: string
}

class EssentialTester {
  private results: TestResult[] = []

  async runTests() {
    console.log('🚀 Основное тестирование системы...')
    
    try {
      await this.testDatabaseConnection()
      await this.testUserCreation()
      await this.testAuthentication()
      await this.testPropertyCreation()
      this.printResults()
    } catch (error) {
      console.error('❌ Ошибка тестирования:', error)
    } finally {
      await prisma.$disconnect()
    }
  }

  private async testDatabaseConnection() {
    await this.testScenario('Подключение к базе данных', async () => {
      await prisma.$queryRaw`SELECT 1`
      return true
    })
  }

  private async testUserCreation() {
    await this.testScenario('Создание пользователя', async () => {
      const hashedPassword = await bcrypt.hash('test123', 10)
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          firstName: 'Тест',
          lastName: 'Пользователь',
          role: 'REALTOR'
        }
      })
      
      await prisma.user.delete({ where: { id: user.id } })
      return user.id
    })
  }

  private async testAuthentication() {
    await this.testScenario('Проверка аутентификации', async () => {
      const password = 'test123'
      const hashedPassword = await bcrypt.hash(password, 10)
      const isValid = await bcrypt.compare(password, hashedPassword)
      return isValid
    })
  }

  private async testPropertyCreation() {
    await this.testScenario('Создание объекта недвижимости', async () => {
      const user = await prisma.user.findFirst()
      if (!user) throw new Error('Пользователь не найден')

      const property = await prisma.property.create({
        data: {
          title: 'Тестовая квартира',
          description: 'Описание тестовой квартиры',
          price: 5000000,
          userId: user.id
        }
      })

      await prisma.property.delete({ where: { id: property.id } })
      return property.id
    })
  }

  private async testScenario(name: string, testFn: () => Promise<any>): Promise<void> {
    try {
      const result = await testFn()
      this.results.push({ scenario: name, success: true })
      console.log(`✅ ${name}`)
    } catch (error) {
      this.results.push({ 
        scenario: name, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      console.log(`❌ ${name}: ${error}`)
    }
  }

  private printResults() {
    console.log('\n📊 Результаты тестирования:')
    console.log('='.repeat(50))
    
    const passed = this.results.filter(r => r.success).length
    const failed = this.results.filter(r => !r.success).length
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${result.scenario}`)
      if (!result.success && result.error) {
        console.log(`   Ошибка: ${result.error}`)
      }
    })
    
    console.log('\n' + '='.repeat(50))
    console.log(`Всего тестов: ${this.results.length}`)
    console.log(`Успешно: ${passed}`)
    console.log(`Провалено: ${failed}`)
  }
}

// Запуск тестов
if (require.main === module) {
  const tester = new EssentialTester()
  tester.runTests()
} 