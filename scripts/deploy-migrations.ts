import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function deployMigrations() {
  try {
    console.log('🚀 Начинаем выполнение миграций...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Проверяем существующие таблицы
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📊 Существующие таблицы:', tables)
    
    // Выполняем миграции
    console.log('🔄 Выполняем миграции...')
    
    // Создаем таблицу users
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "phone" TEXT,
        "role" TEXT NOT NULL DEFAULT 'REALTOR',
        "avatar" TEXT,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем уникальный индекс для email
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")
    `
    
    // Создаем таблицу sessions
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "userAgent" TEXT,
        "ipAddress" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем уникальный индекс для token
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_key" ON "sessions"("token")
    `
    
    // Создаем таблицу properties
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "properties" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
        "address" TEXT NOT NULL,
        "area" DOUBLE PRECISION,
        "bedrooms" INTEGER,
        "bathrooms" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "features" TEXT[],
        "images" TEXT[],
        "price" DOUBLE PRECISION NOT NULL,
        "userId" TEXT NOT NULL,
        CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем таблицу clients
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "clients" (
        "id" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT,
        "phone" TEXT NOT NULL,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT NOT NULL,
        "address" TEXT,
        "birthDate" TIMESTAMP(3),
        "city" TEXT,
        "inn" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "middleName" TEXT,
        "passport" TEXT,
        "snils" TEXT,
        "source" TEXT,
        "type" TEXT NOT NULL DEFAULT 'TENANT',
        CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем таблицу deals
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "deals" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'NEW',
        "amount" DOUBLE PRECISION,
        "startDate" TIMESTAMP(3),
        "endDate" TIMESTAMP(3),
        "userId" TEXT NOT NULL,
        "clientId" TEXT,
        "propertyId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем таблицу contracts
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "contracts" (
        "id" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "signedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "content" TEXT NOT NULL,
        "dealId" TEXT,
        "expiresAt" TIMESTAMP(3),
        "title" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем таблицу payments
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "amount" DOUBLE PRECISION NOT NULL,
        "userId" TEXT NOT NULL,
        "dueDate" TIMESTAMP(3),
        "paidAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "dealId" TEXT,
        CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Создаем таблицу notifications
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "type" TEXT NOT NULL,
        CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
      )
    `
    
    console.log('✅ Миграции выполнены успешно!')
    
    // Проверяем созданные таблицы
    const newTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📊 Таблицы после миграций:', newTables)
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deployMigrations() 