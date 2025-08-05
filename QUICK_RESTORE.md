# ⚡ Быстрый возврат к стабильной версии v1.0

## 🎯 Команды для быстрого восстановления

### 1. Переключение на стабильную ветку
```bash
git checkout stable-version-v1.0
```

### 2. Сброс к стабильному коммиту
```bash
git reset --hard 67d9625
```

### 3. Восстановление из удаленного репозитория
```bash
git fetch origin
git checkout stable-version-v1.0
git pull origin stable-version-v1.0
```

## 🔧 Быстрый деплой
```bash
npx vercel --prod
```

## 🌐 Деплои стабильной версии
- **Основной:** https://mozaikarental.vercel.app
- **Стабильная v1.0 (1):** https://mozaikarental-pjnm9bjoc-nikitas-projects-c62d7451.vercel.app
- **Стабильная v1.0 (2):** https://mozaikarental-o0camp1l3-nikitas-projects-c62d7451.vercel.app

## 🧪 Проверка работоспособности
```bash
# Тест авторизации
curl -X POST https://mozaikarental.vercel.app/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123","firstName":"Тест","lastName":"Пользователь"}'

# Тест базы данных
curl https://mozaikarental.vercel.app/api/test-db

# Быстрое тестирование
npx tsx scripts/quick-test.ts
```

## 📋 Что работает в этой версии
- ✅ Авторизация и регистрация
- ✅ База данных
- ✅ Основные API
- ✅ Хедер и футер
- ✅ Защищенные маршруты
- ✅ Middleware

## ⚠️ Известные проблемы
- ❌ Создание объектов (требует доработки)
- ❌ Валидация данных (ошибки в схеме)
- ❌ Лимит деплоев Vercel

## 📞 Подробная документация
См. `STABLE_VERSION_GUIDE.md` для полной информации. 