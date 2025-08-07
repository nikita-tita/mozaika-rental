# Руководство по системе локализации (i18n)

## Обзор

Система локализации в проекте Mozaika построена на основе библиотеки `next-international` и обеспечивает единообразный русский язык интерфейса с возможностью легкого расширения на другие языки в будущем.

## Структура файлов

```
src/lib/i18n/
├── index.ts          # Основной файл конфигурации i18n
├── ru.ts             # Русские переводы
└── hooks.ts          # Хуки для использования переводов
```

## Основные принципы

### 1. Единый язык интерфейса
- Все текстовые элементы интерфейса переведены на русский язык
- Используется единая терминология во всем приложении
- Поддерживается консистентность в названиях и описаниях

### 2. Структурированные переводы
Переводы организованы по функциональным областям:
- `common` - общие элементы (кнопки, статусы, ошибки)
- `navigation` - элементы навигации
- `auth` - аутентификация и авторизация
- `dashboard` - панель управления
- `properties` - управление недвижимостью
- `clients` - работа с клиентами
- `contracts` - договоры
- `bookings` - бронирования
- `payments` - платежи
- `deals` - сделки
- `scoring` - скоринг
- `multilisting` - мультилистинг
- `settings` - настройки
- `notifications` - уведомления
- `errors` - сообщения об ошибках
- `validation` - валидация форм

### 3. Типизированные переводы
Все переводы типизированы с помощью TypeScript для предотвращения ошибок.

## Использование в компонентах

### Базовое использование

```typescript
import { useTranslations } from '@/lib/i18n/hooks'

function MyComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('common.loading')}</h1>
      <button>{t('common.save')}</button>
    </div>
  )
}
```

### Использование областей (scoped translations)

```typescript
import { useAuthTranslations } from '@/lib/i18n/hooks'

function LoginForm() {
  const t = useAuthTranslations()
  
  return (
    <form>
      <label>{t('email')}</label>
      <input placeholder={t('email')} />
      <button>{t('login')}</button>
    </form>
  )
}
```

### Доступные хуки

```typescript
// Общие переводы
const t = useTranslations()

// Переводы по областям
const authT = useAuthTranslations()
const navT = useNavigationTranslations()
const dashboardT = useDashboardTranslations()
const propertiesT = usePropertiesTranslations()
const clientsT = useClientsTranslations()
const contractsT = useContractsTranslations()
const bookingsT = useBookingsTranslations()
const paymentsT = usePaymentsTranslations()
const dealsT = useDealsTranslations()
const scoringT = useScoringTranslations()
const multilistingT = useMultilistingTranslations()
const settingsT = useSettingsTranslations()
const notificationsT = useNotificationsTranslations()
const errorsT = useErrorsTranslations()
const validationT = useValidationTranslations()
const commonT = useCommonTranslations()
```

## Добавление новых переводов

### 1. Добавление в существующую область

```typescript
// В src/lib/i18n/ru.ts
export default {
  properties: {
    // ... существующие переводы
    newField: 'Новое поле',
    newAction: 'Новое действие',
  }
}
```

### 2. Создание новой области

```typescript
// В src/lib/i18n/ru.ts
export default {
  // ... существующие области
  newSection: {
    title: 'Новый раздел',
    description: 'Описание нового раздела',
    actions: {
      create: 'Создать',
      edit: 'Редактировать',
      delete: 'Удалить',
    }
  }
}
```

### 3. Добавление нового хука

```typescript
// В src/lib/i18n/hooks.ts
export const useNewSectionTranslations = () => useScopedTranslations('newSection')
```

## Лучшие практики

### 1. Именование ключей
- Используйте описательные имена ключей
- Группируйте связанные переводы
- Используйте camelCase для ключей

```typescript
// Хорошо
properties: {
  createSuccess: 'Объект создан успешно',
  updateError: 'Ошибка обновления объекта',
}

// Плохо
properties: {
  success: 'Объект создан успешно',
  error: 'Ошибка обновления объекта',
}
```

### 2. Структурирование переводов
- Группируйте переводы по функциональности
- Используйте вложенные объекты для сложных структур
- Избегайте глубокой вложенности (максимум 3-4 уровня)

### 3. Переиспользование
- Создавайте общие переводы в области `common`
- Переиспользуйте переводы между компонентами
- Избегайте дублирования текста

### 4. Контекст и вариации
- Учитывайте контекст использования перевода
- Создавайте отдельные ключи для разных вариаций
- Используйте параметры для динамического контента

```typescript
// Для динамического контента
validation: {
  minLength: 'Минимальная длина: {min} символов',
  maxLength: 'Максимальная длина: {max} символов',
}
```

## Расширение на другие языки

### 1. Добавление нового языка

```typescript
// В src/lib/i18n/index.ts
export const { useI18n, useScopedI18n, I18nProvider } = createI18n({
  ru: () => import('./ru'),
  en: () => import('./en'), // Новый язык
})

export type Locale = 'ru' | 'en'
export const locales: Locale[] = ['ru', 'en']
export const defaultLocale: Locale = 'ru'
```

### 2. Создание файла переводов

```typescript
// src/lib/i18n/en.ts
export default {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    // ... остальные переводы
  },
  // ... остальные области
}
```

### 3. Обновление провайдера

```typescript
// В компоненте с выбором языка
const [locale, setLocale] = useState<Locale>('ru')

return (
  <I18nProvider locale={locale}>
    {/* Ваше приложение */}
  </I18nProvider>
)
```

## Отладка и тестирование

### 1. Проверка отсутствующих переводов
- Используйте TypeScript для проверки типов
- Добавьте логирование отсутствующих ключей в development режиме

### 2. Тестирование переводов
```typescript
// В тестах
import { renderHook } from '@testing-library/react'
import { useTranslations } from '@/lib/i18n/hooks'

test('should return correct translation', () => {
  const { result } = renderHook(() => useTranslations())
  expect(result.current('common.loading')).toBe('Загрузка...')
})
```

## Миграция существующих компонентов

### Пошаговый процесс

1. **Импорт хуков**
```typescript
import { useCommonTranslations } from '@/lib/i18n/hooks'
```

2. **Использование переводов**
```typescript
const t = useCommonTranslations()

// Заменить хардкод на переводы
<button>{t('save')}</button> // вместо <button>Сохранить</button>
```

3. **Обновление placeholder'ов**
```typescript
<TeamsInput placeholder={t('email')} /> // вместо placeholder="Email"
```

4. **Обновление сообщений об ошибках**
```typescript
setError(t('validation.required')) // вместо setError('Это поле обязательно')
```

### Пример миграции компонента

```typescript
// До
function LoginForm() {
  return (
    <form>
      <label>Email</label>
      <input placeholder="Введите email" />
      <button>Войти</button>
    </form>
  )
}

// После
function LoginForm() {
  const t = useAuthTranslations()
  
  return (
    <form>
      <label>{t('email')}</label>
      <input placeholder={t('email')} />
      <button>{t('login')}</button>
    </form>
  )
}
```

## Заключение

Система локализации обеспечивает:
- ✅ Единообразный русский язык интерфейса
- ✅ Легкое добавление новых переводов
- ✅ Типобезопасность с TypeScript
- ✅ Простое расширение на другие языки
- ✅ Структурированную организацию переводов
- ✅ Переиспользование общих элементов

Для добавления новых переводов или изменения существующих обращайтесь к файлу `src/lib/i18n/ru.ts` и следуйте установленной структуре. 