import bcryptjs from 'bcryptjs'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

// Типы для авторизации
export interface SimpleAuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  verified: boolean
}

export interface SimpleLoginResult {
  success: boolean
  user?: SimpleAuthUser
  message: string
}

export interface SimpleRegisterResult {
  success: boolean
  user?: SimpleAuthUser
  message: string
}

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcryptjs.hash(password, saltRounds)
}

// Проверка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword)
}

// Простая авторизация - проверяем есть ли пользователь в БД
export async function simpleLogin(
  email: string,
  password: string
): Promise<SimpleLoginResult> {
  try {
    console.log('🔍 Простая авторизация для:', email)
    
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ Пользователь не найден')
      return {
        success: false,
        message: 'Пользователь не найден'
      }
    }

    console.log('✅ Пользователь найден в БД')

    // Проверяем пароль
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('🔑 Проверка пароля:', isValidPassword ? 'успешно' : 'неверный пароль')
    
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Неверный пароль'
      }
    }

    const authUser: SimpleAuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified
    }

    console.log('✅ Простая авторизация успешна:', authUser.email)

    return {
      success: true,
      user: authUser,
      message: 'Успешный вход'
    }
  } catch (error) {
    console.error('Ошибка простой авторизации:', error)
    return {
      success: false,
      message: 'Ошибка при авторизации'
    }
  }
}

// Простая регистрация
export async function simpleRegister(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<SimpleRegisterResult> {
  try {
    console.log('🔍 Простая регистрация для:', email)
    
    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        success: false,
        message: 'Пользователь с таким email уже существует'
      }
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(password)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone
      }
    })

    const authUser: SimpleAuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified
    }

    console.log('✅ Простая регистрация успешна:', authUser.email)

    return {
      success: true,
      user: authUser,
      message: 'Пользователь успешно зарегистрирован'
    }
  } catch (error) {
    console.error('Ошибка простой регистрации:', error)
    return {
      success: false,
      message: 'Ошибка при регистрации пользователя'
    }
  }
}

// Проверка существования пользователя в БД
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return !!user
  } catch (error) {
    console.error('Ошибка проверки пользователя:', error)
    return false
  }
}

// Получение пользователя по email
export async function getUserByEmail(email: string): Promise<SimpleAuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified
    }
  } catch (error) {
    console.error('Ошибка получения пользователя:', error)
    return null
  }
}

// Получение всех пользователей (для тестирования)
export async function getAllUsers(): Promise<SimpleAuthUser[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verified: true
      }
    })
    return users
  } catch (error) {
    console.error('Ошибка получения пользователей:', error)
    return []
  }
} 