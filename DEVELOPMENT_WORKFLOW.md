# 🔄 Руководство по разработке в новых ветках

## 🎯 Принцип работы

### Стабильная версия
- **URL:** https://mozaikarentalstableversionv1.vercel.app
- **Ветка:** `stable-version-v1.0`
- **Статус:** НЕ ТРОГАТЬ - оставить рабочей
- **Назначение:** Резервная копия стабильной версии

### Разработка
- **Ветка:** `development-v1.1` (текущая)
- **Деплой:** Создается отдельно для каждой версии
- **Статус:** Активная разработка
- **Назначение:** Новые функции и исправления

## 🚀 Рабочий процесс

### 1. Создание новой ветки для фичи
```bash
# Переключиться на ветку разработки
git checkout development-v1.1

# Создать новую ветку для фичи
git checkout -b feature/new-feature-name

# Внести изменения
# ...

# Закоммитить изменения
git add .
git commit -m "feat: добавлена новая функция"

# Отправить в репозиторий
git push origin feature/new-feature-name
```

### 2. Создание деплоя для тестирования
```bash
# Переключиться на ветку с фичей
git checkout feature/new-feature-name

# Создать деплой для тестирования
npx vercel --prod

# Получить URL деплоя
npx vercel ls
```

### 3. Тестирование
```bash
# Быстрое тестирование
npx tsx scripts/quick-test.ts

# Полное тестирование (если нужно)
npx tsx scripts/comprehensive-testing.ts
```

### 4. Слияние в ветку разработки
```bash
# Переключиться на ветку разработки
git checkout development-v1.1

# Слить фичу
git merge feature/new-feature-name

# Отправить изменения
git push origin development-v1.1
```

### 5. Создание деплоя разработки
```bash
# Создать деплой ветки разработки
npx vercel --prod

# Обновить документацию с новым URL
```

## 📋 Структура веток

### Основные ветки
```
main
├── stable-version-v1.0 (НЕ ТРОГАТЬ)
└── development-v1.1 (активная разработка)
    ├── feature/fix-properties-api
    ├── feature/improve-validation
    ├── feature/add-rate-limiting
    └── feature/security-improvements
```

### Правила именования
- `feature/` - новые функции
- `fix/` - исправления багов
- `improve/` - улучшения
- `refactor/` - рефакторинг

## 🌐 Деплои

### Стабильные деплои
- **v1.0:** https://mozaikarentalstableversionv1.vercel.app (НЕ ТРОГАТЬ)

### Деплои разработки
- **development-v1.1:** (будет создан)
- **feature branches:** (создаются по необходимости)

### Создание нового деплоя
```bash
# Создать деплой с кастомным именем
npx vercel --prod

# Или указать ветку
npx vercel --prod --git-branch feature/new-feature
```

## 📊 Отслеживание изменений

### Документация деплоев
Создавать файл `DEPLOYMENTS.md` с информацией о всех деплоях:

```markdown
# Деплои проекта

## Стабильные
- v1.0: https://mozaikarentalstableversionv1.vercel.app

## Разработка
- development-v1.1: [URL деплоя]
- feature/new-feature: [URL деплоя]

## Тестирование
- test-branch: [URL деплоя]
```

### Логирование изменений
```bash
# Посмотреть историю коммитов
git log --oneline

# Посмотреть изменения в ветке
git diff main..development-v1.1

# Посмотреть статус
git status
```

## 🧪 Тестирование

### Перед деплоем
1. Запустить быстрые тесты
2. Проверить основные функции
3. Убедиться в отсутствии критических ошибок

### После деплоя
1. Проверить доступность сайта
2. Протестировать основные функции
3. Проверить API endpoints
4. Обновить документацию

## ⚠️ Важные правила

### НЕ ДЕЛАТЬ
- ❌ Не трогать ветку `stable-version-v1.0`
- ❌ Не деплоить на стабильный URL
- ❌ Не мержить неоттестированные изменения
- ❌ Не коммитить в main напрямую

### ОБЯЗАТЕЛЬНО
- ✅ Создавать отдельные ветки для фич
- ✅ Тестировать перед деплоем
- ✅ Документировать новые деплои
- ✅ Обновлять документацию
- ✅ Создавать отдельные деплои для каждой версии

## 🔄 Пример рабочего процесса

### День 1: Начало работы
```bash
# 1. Переключиться на ветку разработки
git checkout development-v1.1

# 2. Создать ветку для новой фичи
git checkout -b feature/fix-properties-api

# 3. Внести изменения
# ... работа с кодом ...

# 4. Закоммитить
git add .
git commit -m "fix: исправлен API создания объектов"

# 5. Отправить в репозиторий
git push origin feature/fix-properties-api
```

### День 2: Тестирование
```bash
# 1. Создать деплой для тестирования
npx vercel --prod

# 2. Получить URL деплоя
npx vercel ls

# 3. Протестировать
npx tsx scripts/quick-test.ts

# 4. Если все хорошо - мержить
git checkout development-v1.1
git merge feature/fix-properties-api
git push origin development-v1.1
```

### День 3: Деплой разработки
```bash
# 1. Создать деплой ветки разработки
npx vercel --prod

# 2. Обновить документацию
# Добавить новый URL в DEPLOYMENTS.md
```

## 📞 Полезные команды

### Git команды
```bash
# Посмотреть все ветки
git branch -a

# Переключиться на ветку
git checkout branch-name

# Создать новую ветку
git checkout -b new-branch-name

# Посмотреть статус
git status

# Посмотреть историю
git log --oneline
```

### Vercel команды
```bash
# Создать деплой
npx vercel --prod

# Посмотреть деплои
npx vercel ls

# Посмотреть логи
npx vercel logs

# Удалить деплой
npx vercel remove
```

### Тестирование
```bash
# Быстрое тестирование
npx tsx scripts/quick-test.ts

# Полное тестирование
npx tsx scripts/comprehensive-testing.ts

# Проверка базы данных
curl https://your-deployment-url.vercel.app/api/test-db
```

---

**🎯 Цель: Сохранить стабильную версию рабочей и вести разработку в отдельных ветках с отдельными деплоями.** 