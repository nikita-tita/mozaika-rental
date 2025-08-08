# 🚀 Ручной деплой M² Rental Platform

## ⚠️ Проблема с лимитом Vercel CLI

Достигнут лимит бесплатных деплоев (более 100 за день). Ожидание: 58 минут.

## 📋 Альтернативные способы деплоя

### 1. Через Vercel Dashboard (Рекомендуется)

1. **Откройте Vercel Dashboard**:
   - Перейдите на https://vercel.com/dashboard
   - Войдите в аккаунт `nikita-tita`

2. **Найдите проект**:
   - Найдите проект `mozaika-rental`
   - Или создайте новый проект

3. **Создайте новый деплой**:
   - Нажмите "New Project"
   - Подключите GitHub репозиторий: `nikita-tita/mozaika-rental`
   - Выберите ветку: `production-ready-v2.0`

4. **Настройте переменные окружения**:
   ```env
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   LOG_LEVEL=INFO
   ```

5. **Задеплойте**:
   - Нажмите "Deploy"
   - Дождитесь завершения сборки

### 2. Через GitHub Integration

1. **Настройте автоматический деплой**:
   - В Vercel Dashboard перейдите в настройки проекта
   - Включите "Auto Deploy" для ветки `production-ready-v2.0`

2. **Создайте коммит в main**:
   ```bash
   git checkout main
   git merge production-ready-v2.0
   git push origin main
   ```

### 3. Через GitHub Actions (Настроено)

GitHub Action уже настроен в `.github/workflows/deploy.yml`:

1. **Добавьте секреты в GitHub**:
   - Перейдите в Settings → Secrets and variables → Actions
   - Добавьте:
     - `VERCEL_TOKEN`
     - `ORG_ID`
     - `PROJECT_ID`

2. **Запустите Action**:
   - Перейдите в Actions
   - Нажмите "Run workflow"
   - Выберите ветку `production-ready-v2.0`

## 🔧 Проверка готовности

### Локальные тесты пройдены:
- ✅ `npm run build` - успешно
- ✅ `npm run dev` - работает на localhost:3000
- ✅ API endpoints - отвечают корректно
- ✅ Все конфликты - устранены

### Исправленные проблемы:
- ✅ API страхования - исправлены импорты
- ✅ SSR ошибки - исправлены
- ✅ Конфигурация Next.js - оптимизирована

## 📊 Ожидаемый результат

После успешного деплоя:
- 🌐 Сайт будет доступен по URL: `https://mozaika-*.vercel.app`
- 🔐 Авторизация будет работать
- 📱 Все страницы будут загружаться
- 🚀 API endpoints будут функционировать

## 🐛 Возможные проблемы

1. **Ошибки сборки**: Проверьте логи в Vercel Dashboard
2. **Проблемы с БД**: Убедитесь, что DATABASE_URL корректный
3. **CORS ошибки**: Проверьте настройки в vercel.json

## 📞 Быстрая помощь

Если нужна помощь:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте подключение к базе данных

---

**Статус**: ✅ Готов к деплою  
**Версия**: v2.0-production-ready  
**Ветка**: production-ready-v2.0  
**Дата**: 8 августа 2025 