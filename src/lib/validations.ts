import { z } from 'zod'

// Схема для создания объекта недвижимости
export const CreatePropertySchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  address: z.string().min(1, 'Адрес обязателен'),
  city: z.string().optional(),
  district: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND']),
  pricePerMonth: z.coerce.number().positive('Арендная плата должна быть положительной'),
  deposit: z.coerce.number().min(0, 'Депозит не может быть отрицательным').optional(),
  bedrooms: z.coerce.number().int().min(0, 'Количество спален не может быть отрицательным').optional(),
  bathrooms: z.coerce.number().int().min(0, 'Количество ванных не может быть отрицательным').optional(),
  rooms: z.coerce.number().int().min(0, 'Количество комнат не может быть отрицательным').optional(),
  area: z.coerce.number().positive('Площадь должна быть положительной').optional(),
  features: z.array(z.string()).optional()
})

// Схема для создания клиента
export const CreateClientSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  middleName: z.string().optional(),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
  phone: z.string().min(1, 'Телефон обязателен'),
  birthDate: z.string().optional(),
  type: z.enum(['TENANT', 'LANDLORD', 'BOTH']),
  passport: z.string().optional(),
  snils: z.string().optional(),
  inn: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional()
})

// Схема для создания сделки
export const CreateDealSchema = z.object({
  title: z.string().min(1, 'Название сделки обязательно'),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  propertyId: z.string().min(1, 'Объект недвижимости обязателен'),
  tenantId: z.string().min(1, 'Арендатор обязателен'),
  landlordId: z.string().min(1, 'Арендодатель обязателен'),
  monthlyRent: z.coerce.number().positive('Сумма аренды должна быть положительной'),
  deposit: z.coerce.number().min(0, 'Залог не может быть отрицательным').optional(),
  startDate: z.string().min(1, 'Дата начала обязательна'),
  endDate: z.string().optional(),
  commission: z.coerce.number().min(0, 'Комиссия не может быть отрицательной').optional()
})

// Схема для создания контракта
export const CreateContractSchema = z.object({
  title: z.string().min(1, 'Название договора обязательно'),
  content: z.string().min(1, 'Содержание договора обязательно'),
  dealId: z.string().min(1, 'Сделка обязательна'),
  propertyId: z.string().min(1, 'Объект недвижимости обязателен'),
  tenantId: z.string().min(1, 'Арендатор обязателен'),
  landlordId: z.string().min(1, 'Арендодатель обязателен'),
  monthlyRent: z.coerce.number().positive('Сумма аренды должна быть положительной'),
  deposit: z.coerce.number().min(0, 'Залог не может быть отрицательным').optional(),
  startDate: z.string().min(1, 'Дата начала обязательна'),
  endDate: z.string().min(1, 'Дата окончания обязательна'),
  additionalTerms: z.string().optional()
})

// Схема для создания платежа
export const CreatePaymentSchema = z.object({
  amount: z.coerce.number().positive('Сумма должна быть положительной'),
  type: z.enum(['RENT', 'DEPOSIT', 'UTILITIES', 'MAINTENANCE']),
  dueDate: z.string().datetime().optional(),
  dealId: z.string().optional()
})

// Схема для регистрации пользователя
export const RegisterUserSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  phone: z.string().optional()
})

// Схема для входа пользователя
export const LoginUserSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен')
})

// Типы для TypeScript
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>
export type CreateClientInput = z.infer<typeof CreateClientSchema>
export type CreateDealInput = z.infer<typeof CreateDealSchema>
export type CreateContractInput = z.infer<typeof CreateContractSchema>
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
export type LoginUserInput = z.infer<typeof LoginUserSchema> 