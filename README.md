# M² - Платформа для риелторов

Профессиональная платформа для управления недвижимостью с полным набором инструментов для риелторов.

## 🚀 Возможности

- **Управление клиентами** - база данных клиентов и арендаторов
- **Каталог недвижимости** - управление объектами недвижимости
- **Генерация договоров** - создание юридических документов
- **Цифровая подпись** - безопасное подписание документов
- **Платежи** - автоматизация расчетов
- **Аналитика** - отчеты и статистика

## 🛠️ Технологии

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Teams UI Kit, Tailwind CSS
- **Database**: PostgreSQL с Prisma ORM
- **Authentication**: JWT с cookies
- **Deployment**: Vercel

## 📦 Быстрый старт

### 1. Установка
```bash
git clone <repository-url>
cd mozaika
npm install
```

### 2. Настройка
```bash
cp env.example .env
# Настройте DATABASE_URL и JWT_SECRET в .env
```

### 3. База данных
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Запуск
```bash
npm run dev
```

Приложение: http://localhost:3000

### Тестовые данные
- **Email**: test@example.com
- **Пароль**: test123

## 📁 Структура

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/       # Защищенные страницы
│   ├── api/              # API endpoints
│   └── layout.tsx        # Корневой layout
├── components/           # React компоненты
│   ├── ui/              # UI компоненты
│   └── teams/           # Teams UI Kit
├── lib/                 # Утилиты
└── types/               # TypeScript типы
```

## 🧪 Тестирование

```bash
# Основные тесты
npx tsx scripts/essential-testing.ts

# Создание тестового пользователя
npx tsx scripts/create-test-user.ts

# Валидация системы
npx tsx scripts/validate-system.ts
```

## 📚 Документация

Подробная документация: [CONSOLIDATED_DOCUMENTATION.md](./CONSOLIDATED_DOCUMENTATION.md)

## 🚀 Деплой

Автоматический деплой на Vercel при push в main ветку.

---

*M² Platform - Профессиональные инструменты для риелторов*