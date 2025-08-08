# Настройка переменных окружения на Vercel

## Проблема
Функциональность добавления клиентов и объектов не работает на Vercel из-за отсутствия правильной настройки базы данных.

## Решение

### 1. Перейдите в Vercel Dashboard
- Откройте [Vercel Dashboard](https://vercel.com/dashboard)
- Найдите проект `mozaikarental`
- Перейдите в настройки проекта

### 2. Добавьте переменные окружения
В разделе "Environment Variables" добавьте следующие переменные:

#### DATABASE_URL
```
postgresql://neondb_owner:npg_VmJ1Inzul5ig@ep-proud-flower-aewnusem.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### JWT_SECRET
```
mozaika-jwt-secret-key-2024-rental-platform-secure-random-string-32-chars
```

#### LOG_LEVEL
```
INFO
```

### 3. Настройте окружения
Убедитесь, что переменные добавлены для всех окружений:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4. Перезапустите деплой
После добавления переменных:
1. Перейдите в раздел "Deployments"
2. Найдите последний деплой
3. Нажмите "Redeploy"

### 5. Проверьте работу
После перезапуска проверьте:
- [https://mozaikarental.vercel.app/clients](https://mozaikarental.vercel.app/clients) - добавление клиентов
- [https://mozaikarental.vercel.app/properties/new](https://mozaikarental.vercel.app/properties/new) - добавление объектов

## Альтернативное решение через CLI

Если у вас установлен Vercel CLI:

```bash
# Добавить переменные окружения
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add LOG_LEVEL production

# Перезапустить деплой
vercel --prod
```

## Проверка
После настройки API должно работать:
- ✅ Добавление клиентов
- ✅ Добавление объектов
- ✅ Аутентификация
- ✅ Все CRUD операции 