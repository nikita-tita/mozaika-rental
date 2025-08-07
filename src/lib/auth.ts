import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient, User, Session } from '@prisma/client'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
const SESSION_EXPIRY_DAYS = 30

// Типы для авторизации
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  verified: boolean
}

export interface LoginResult {
  success: boolean
  user?: AuthUser
  token?: string
  message: string
}

export interface RegisterResult {
  success: boolean
  user?: AuthUser
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

// Генерация JWT токена
export function generateJWTToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: `${SESSION_EXPIRY_DAYS}d` }
  )
}

// Проверка JWT токена
export function verifyJWTToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

// Создание сессии пользователя
export async function createUserSession(
  userId: string, 
  userAgent?: string, 
  ipAddress?: string
): Promise<Session> {
  // Получаем данные пользователя для токена
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('Пользователь не найден')
  }

  const token = generateJWTToken(userId, user.email, user.role)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  return prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      userAgent,
      ipAddress
    }
  })
}

// Проверка сессии
export async function verifySession(token: string): Promise<Session | null> {
  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date()
      }
    }
  })

  return session
}

// Получение пользователя по токену
export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const session = await verifySession(token)
  if (!session) return null

  // Получаем пользователя отдельно
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
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
}

// Деактивация сессии
export async function deactivateSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token }
  })
}

// Очистка истекших сессий
export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}

// Регистрация пользователя
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<RegisterResult> {
  try {
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

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified
    }

    return {
      success: true,
      user: authUser,
      message: 'Пользователь успешно зарегистрирован'
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    return {
      success: false,
      message: 'Ошибка при регистрации пользователя'
    }
  }
}

// Авторизация пользователя
export async function loginUser(
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<LoginResult> {
  try {
    console.log('🔍 Поиск пользователя:', email)
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ Пользователь не найден')
      return {
        success: false,
        message: 'Неверный email или пароль'
      }
    }

    console.log('✅ Пользователь найден, проверяем пароль')

    // Проверяем пароль
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('🔑 Проверка пароля:', isValidPassword ? 'успешно' : 'неверный пароль')
    
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Неверный email или пароль'
      }
    }

    // Проверяем, активен ли пользователь (если колонка существует)
    console.log('👤 Статус пользователя:', { verified: user.verified })
    // Убираем проверку active, так как колонка может отсутствовать в продакшн БД

    // Обновление lastLogin убрано, так как колонка отсутствует в продакшн БД

    // Генерируем простой JWT токен без сессии
    const token = generateJWTToken(user.id, user.email, user.role)
    console.log('✅ JWT токен сгенерирован')

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified
    }

    return {
      success: true,
      user: authUser,
      token: token,
      message: 'Успешный вход'
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error)
    console.error('Детали ошибки:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      message: 'Ошибка при авторизации'
    }
  }
}

// Выход пользователя
export async function logoutUser(token: string): Promise<boolean> {
  try {
    await deactivateSession(token)
    return true
  } catch (error) {
    console.error('Ошибка выхода:', error)
    return false
  }
}

// Получение текущего пользователя
export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    // Проверяем JWT токен
    const decoded = verifyJWTToken(token)
    if (!decoded) {
      return null
    }

    // Получаем пользователя из базы
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return null
    }

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

// Очистка данных пользователя (без пароля)
export function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...sanitizedUser } = user
  return sanitizedUser
}