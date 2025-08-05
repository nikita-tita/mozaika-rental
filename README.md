# M² - Сервисы для аренды недвижимости

Профессиональная платформа для управления арендой недвижимости с полным набором инструментов для риелторов и арендодателей.

## 🚀 Возможности

### Основные сервисы
- **Скоринг арендаторов** - проверка платежеспособности через НБКИ и ФССП
- **Генерация договоров** - создание юридически корректных документов
- **Цифровая подпись** - безопасное подписание документов онлайн
- **Платежи и расчеты** - автоматизация расчетов арендной платы
- **Аналитика и отчеты** - детальная аналитика доходности
- **Правовая защита** - юридическое сопровождение сделок
- **Мультилистинг** - публикация на всех площадках
- **Управление сделками** - полный цикл сопровождения

### Управление данными
- База клиентов и арендаторов
- Каталог объектов недвижимости
- История сделок и платежей
- Документооборот

## 🛠️ Технологии

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Lucide Icons
- **State Management**: Zustand
- **Database**: PostgreSQL с Prisma ORM
- **Authentication**: JWT с cookie-based auth
- **Deployment**: Vercel

## 📦 Установка и запуск

### Предварительные требования
- Node.js 18+ 
- PostgreSQL
- npm или yarn

### Локальная разработка

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd mozaika
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка базы данных**
```bash
# Создание .env файла
cp env.example .env

# Настройка переменных окружения в .env
DATABASE_URL="postgresql://username:password@localhost:5432/m2_rental"
JWT_SECRET="your-secret-key"
```

4. **Миграция базы данных**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Создание тестового пользователя**
```bash
npx tsx scripts/create-test-user.ts
```

6. **Запуск в режиме разработки**
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3002

### Тестовые данные
- **Email**: test@example.com
- **Пароль**: test123
- **Роль**: REALTOR

## 🏗️ Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── deals/             # Управление сделками
│   ├── mosaic/            # Главная страница сервисов
│   ├── scoring/           # Скоринг арендаторов
│   ├── contracts/         # Генерация договоров
│   ├── signature/         # Цифровая подпись
│   ├── payments/          # Платежи и расчеты
│   ├── analytics/         # Аналитика и отчеты
│   ├── legal/             # Правовая защита
│   ├── multilisting/      # Мультилистинг
│   └── ...
├── components/            # React компоненты
│   ├── ui/               # UI компоненты
│   └── providers/        # Провайдеры состояния
├── lib/                  # Утилиты и конфигурация
│   ├── auth.ts          # Аутентификация
│   ├── prisma.ts        # База данных
│   └── state/           # Zustand stores
└── types/               # TypeScript типы
```

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход из системы
- `GET /api/auth/me` - Получение данных пользователя
- `POST /api/auth/verify` - Проверка токена

### Пользователи
- `GET /api/users` - Список пользователей
- `POST /api/users` - Создание пользователя
- `GET /api/users/:id` - Получение пользователя
- `PUT /api/users/:id` - Обновление пользователя

### Объекты недвижимости
- `GET /api/properties` - Список объектов
- `POST /api/properties` - Создание объекта
- `GET /api/properties/:id` - Получение объекта
- `PUT /api/properties/:id` - Обновление объекта

## 🚀 Деплой

### Vercel

1. **Подключение к Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Настройка переменных окружения**
- `DATABASE_URL` - URL базы данных PostgreSQL
- `JWT_SECRET` - Секретный ключ для JWT
- `NEXTAUTH_URL` - URL приложения

3. **Деплой**
```bash
vercel --prod
```

### Environment Variables

```env
# База данных
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT
JWT_SECRET="your-secret-key"

# Next.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"

# Опционально
NODE_ENV="production"
```

## 📊 База данных

### Основные таблицы
- `User` - Пользователи системы
- `Property` - Объекты недвижимости
- `Booking` - Бронирования/сделки
- `Contract` - Договоры аренды
- `Payment` - Платежи

### Миграции
```bash
# Создание новой миграции
npx prisma migrate dev --name migration_name

# Применение миграций в production
npx prisma migrate deploy

# Сброс базы данных (только для разработки)
npx prisma migrate reset
```

## 🔒 Безопасность

- JWT токены с httpOnly cookies
- Middleware для защиты маршрутов
- Валидация входных данных
- Защита от CSRF атак
- Безопасное хранение паролей

## 📱 Адаптивность

Приложение полностью адаптивно и оптимизировано для:
- Мобильных устройств
- Планшетов
- Десктопов
- Больших экранов

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Запуск тестов с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e
```

## 📈 Мониторинг и аналитика

- Встроенная аналитика производительности
- Логирование ошибок
- Мониторинг API endpoints
- Метрики пользовательского опыта

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

- **Email**: support@m2-rental.com
- **Документация**: [docs.m2-rental.com](https://docs.m2-rental.com)
- **Telegram**: [@m2_rental_support](https://t.me/m2_rental_support)

## 🗺️ Roadmap

### Версия 2.0
- [ ] Интеграция с банковскими API
- [ ] Мобильное приложение
- [ ] ИИ для анализа рынка
- [ ] Интеграция с кадастром

### Версия 3.0
- [ ] Блокчейн для документов
- [ ] Виртуальные туры
- [ ] Автоматическое ценообразование
- [ ] Интеграция с CRM системами

---

**M² - Сделка сложится как по нотам** 🎵# Vercel Deployment Update - Wed Aug  6 01:21:22 MSK 2025
