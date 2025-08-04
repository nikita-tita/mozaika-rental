# Microsoft Teams UI Kit - Руководство по переиспользованию

## Обзор

UI кит Microsoft Teams предоставляет полный набор компонентов в стиле Microsoft Teams для создания современного и консистентного интерфейса в приложении Mozaika.

## Установка и настройка

### Импорт компонентов

```typescript
import {
  TeamsButton,
  TeamsInput,
  TeamsSelect,
  TeamsCard,
  TeamsModal,
  TeamsTable,
  TeamsBadge,
  TeamsTabs,
  TeamsAlert,
  TeamsTooltip,
  TeamsNavigation,
  TeamsLoadingOverlay,
  TeamsSkeleton,
  TeamsNotificationCenter,
  TeamsErrorBoundary
} from '@/components/ui/teams'
```

### Тема

```typescript
import { teamsTheme } from '@/components/ui/teams'

// Применение темы
<div className={teamsTheme.container}>
  {/* Ваш контент */}
</div>
```

## Основные компоненты

### 1. TeamsButton

Кнопки в стиле Microsoft Teams с различными вариантами и размерами.

```typescript
// Варианты
<TeamsButton variant="primary">Primary</TeamsButton>
<TeamsButton variant="secondary">Secondary</TeamsButton>
<TeamsButton variant="outline">Outline</TeamsButton>
<TeamsButton variant="ghost">Ghost</TeamsButton>
<TeamsButton variant="danger">Danger</TeamsButton>

// Размеры
<TeamsButton size="sm">Small</TeamsButton>
<TeamsButton size="md">Medium</TeamsButton>
<TeamsButton size="lg">Large</TeamsButton>

// С иконками
<TeamsButton icon={<Plus className="h-4 w-4" />}>
  Добавить
</TeamsButton>

// Состояние загрузки
<TeamsButton loading>Загрузка</TeamsButton>
```

### 2. TeamsInput

Поля ввода с поддержкой различных состояний.

```typescript
// Базовое поле
<TeamsInput placeholder="Введите текст..." />

// С ошибкой
<TeamsInput placeholder="Ошибка" error />

// Отключенное
<TeamsInput placeholder="Отключено" disabled />

// Как textarea
<TeamsInput as="textarea" rows={3} placeholder="Многострочный текст" />
```

### 3. TeamsSelect

Выпадающие списки с поддержкой опций.

```typescript
<TeamsSelect
  label="Выберите опцию"
  options={[
    { value: 'option1', label: 'Опция 1' },
    { value: 'option2', label: 'Опция 2' },
    { value: 'option3', label: 'Опция 3', disabled: true }
  ]}
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
/>
```

### 4. TeamsCard

Карточки для группировки контента.

```typescript
<TeamsCard>
  <h3>Заголовок карточки</h3>
  <p>Содержимое карточки</p>
</TeamsCard>

// С hover эффектом
<TeamsCard className="hover:shadow-lg transition-shadow">
  {/* Контент */}
</TeamsCard>
```

### 5. TeamsBadge

Бейджи для отображения статусов и меток.

```typescript
<TeamsBadge variant="default">Default</TeamsBadge>
<TeamsBadge variant="primary">Primary</TeamsBadge>
<TeamsBadge variant="success">Success</TeamsBadge>
<TeamsBadge variant="warning">Warning</TeamsBadge>
<TeamsBadge variant="error">Error</TeamsBadge>
<TeamsBadge variant="info">Info</TeamsBadge>
```

### 6. TeamsTable

Таблицы с поддержкой сортировки и действий.

```typescript
<TeamsTable>
  <TeamsTableHeader>
    <tr>
      <TeamsTableHeaderCell>Заголовок 1</TeamsTableHeaderCell>
      <TeamsTableHeaderCell>Заголовок 2</TeamsTableHeaderCell>
    </tr>
  </TeamsTableHeader>
  <TeamsTableBody>
    <TeamsTableRow>
      <TeamsTableCell>Данные 1</TeamsTableCell>
      <TeamsTableCell>Данные 2</TeamsTableCell>
    </TeamsTableRow>
  </TeamsTableBody>
</TeamsTable>
```

### 7. TeamsModal

Модальные окна с поддержкой различных размеров.

```typescript
<TeamsModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Заголовок модального окна"
  size="lg"
  footer={
    <>
      <TeamsButton variant="secondary" onClick={() => setIsModalOpen(false)}>
        Отмена
      </TeamsButton>
      <TeamsButton onClick={handleSubmit}>
        Подтвердить
      </TeamsButton>
    </>
  }
>
  <p>Содержимое модального окна</p>
</TeamsModal>
```

### 8. TeamsTabs

Вкладки для организации контента.

```typescript
const tabs = [
  {
    id: 'tab1',
    label: 'Вкладка 1',
    content: <div>Содержимое вкладки 1</div>
  },
  {
    id: 'tab2',
    label: 'Вкладка 2',
    content: <div>Содержимое вкладки 2</div>
  }
]

<TeamsTabs
  tabs={tabs}
  defaultTab="tab1"
  onChange={setActiveTab}
/>
```

### 9. TeamsAlert

Уведомления и предупреждения.

```typescript
<TeamsAlert variant="info" title="Информация">
  Информационное сообщение
</TeamsAlert>

<TeamsAlert variant="success" title="Успех">
  Операция выполнена успешно
</TeamsAlert>

<TeamsAlert variant="warning" title="Предупреждение">
  Внимание! Это предупреждающее сообщение
</TeamsAlert>

<TeamsAlert variant="error" title="Ошибка">
  Произошла ошибка
</TeamsAlert>
```

### 10. TeamsNavigation

Навигационная панель в стиле Teams.

```typescript
<TeamsNavigation />
```

### 11. TeamsLoadingOverlay

Оверлей загрузки с прогресс-баром.

```typescript
<TeamsLoadingOverlay
  isLoading={loading}
  message="Загрузка данных..."
  progress={75}
/>
```

### 12. TeamsSkeleton

Скелетоны для состояния загрузки.

```typescript
// Карточка
<TeamsSkeleton variant="card" />

// С определенным количеством строк
<TeamsSkeleton variant="card" lines={3} />
```

### 13. TeamsNotificationCenter

Центр уведомлений.

```typescript
<TeamsNotificationCenter />
```

### 14. TeamsErrorBoundary

Обработка ошибок.

```typescript
<TeamsErrorBoundary>
  <YourComponent />
</TeamsErrorBoundary>
```

## Паттерны использования

### 1. Страница со списком

```typescript
export default function ListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamsNavigation />
      
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Заголовок страницы
            </h1>
            <p className="mt-2 text-gray-600">
              Описание страницы
            </p>
          </div>

          {/* Фильтры */}
          <TeamsCard className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TeamsSelect
                label="Фильтр 1"
                options={filterOptions}
                value={filter1}
                onChange={(e) => setFilter1(e.target.value)}
              />
              <div className="flex gap-2">
                <TeamsButton
                  variant={viewMode === 'cards' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  Карточки
                </TeamsButton>
                <TeamsButton
                  variant={viewMode === 'table' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Таблица
                </TeamsButton>
              </div>
            </div>
          </TeamsCard>

          {/* Список */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <TeamsSkeleton key={i} variant="card" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <TeamsCard>
              <div className="text-center py-12">
                <p>Элементы не найдены</p>
              </div>
            </TeamsCard>
          ) : viewMode === 'table' ? (
            <TeamsCard>
              <TeamsTable>
                {/* Таблица */}
              </TeamsTable>
            </TeamsCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Карточки */}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
```

### 2. Форма

```typescript
export default function FormPage() {
  const [formData, setFormData] = useState({})
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamsNavigation />
      
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <TeamsCard>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamsInput
                  name="field1"
                  placeholder="Поле 1"
                  value={formData.field1}
                  onChange={handleChange}
                  required
                />
                <TeamsSelect
                  name="field2"
                  options={selectOptions}
                  value={formData.field2}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <TeamsButton
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Отмена
                </TeamsButton>
                <TeamsButton onClick={handleSubmit}>
                  Сохранить
                </TeamsButton>
              </div>
            </form>
          </TeamsCard>
        </main>
      </div>
    </div>
  )
}
```

### 3. Dashboard

```typescript
export default function DashboardPage() {
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])

  const tabs = [
    {
      id: 'overview',
      label: 'Обзор',
      content: (
        <div className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamsCard>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Метрика</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.value}</p>
                </div>
              </div>
            </TeamsCard>
          </div>

          {/* Быстрые действия */}
          <TeamsCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Быстрые действия
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Действия */}
            </div>
          </TeamsCard>
        </div>
      )
    },
    {
      id: 'activity',
      label: 'Активность',
      content: (
        <TeamsCard>
          <TeamsTable>
            {/* Таблица активности */}
          </TeamsTable>
        </TeamsCard>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamsNavigation />
      
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
          </div>

          <TeamsTabs tabs={tabs} defaultTab="overview" />
        </main>
      </div>
    </div>
  )
}
```

## Цветовая схема

UI кит использует цветовую схему Microsoft Teams:

- **Primary (Blue)**: #0078d4
- **Success (Green)**: #107c10
- **Warning (Orange)**: #ff8c00
- **Error (Red)**: #d13438
- **Info (Blue)**: #0078d4
- **Default (Gray)**: #605e5c

## Адаптивность

Все компоненты адаптивны и корректно отображаются на различных устройствах:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Доступность

Компоненты включают поддержку:

- ARIA атрибутов
- Клавиатурной навигации
- Screen reader совместимости
- Высокого контраста

## Миграция с существующих компонентов

### Замена Button

```typescript
// Было
import { Button } from '@/components/ui/Button'
<Button variant="primary">Кнопка</Button>

// Стало
import { TeamsButton } from '@/components/ui/teams'
<TeamsButton variant="primary">Кнопка</TeamsButton>
```

### Замена Input

```typescript
// Было
import { Input } from '@/components/ui/Input'
<Input placeholder="Введите текст" />

// Стало
import { TeamsInput } from '@/components/ui/teams'
<TeamsInput placeholder="Введите текст" />
```

### Замена Select

```typescript
// Было
import { Select } from '@/components/ui/Select'
<Select options={options} value={value} onChange={onChange} />

// Стало
import { TeamsSelect } from '@/components/ui/teams'
<TeamsSelect options={options} value={value} onChange={onChange} />
```

## Лучшие практики

1. **Консистентность**: Используйте одинаковые компоненты для похожих элементов
2. **Доступность**: Всегда добавляйте alt-тексты для изображений и aria-labels для интерактивных элементов
3. **Адаптивность**: Тестируйте на различных размерах экранов
4. **Производительность**: Используйте React.memo для компонентов, которые часто перерендериваются
5. **Типизация**: Используйте TypeScript для лучшей разработки

## Примеры интеграции

### Properties Page
- Использует TeamsCard для карточек недвижимости
- TeamsTable для табличного представления
- TeamsModal для добавления новых объектов
- TeamsBadge для статусов

### Bookings Page
- TeamsBadge для статусов бронирований
- TeamsButton для действий
- TeamsTable и карточки для разных режимов просмотра

### Contracts Page
- Аналогичная структура с bookings
- TeamsModal для подписания договоров

### Payments Page
- TeamsBadge для статусов платежей
- Цветовое кодирование просроченных платежей
- TeamsTable с расширенной информацией

## Заключение

UI кит Microsoft Teams обеспечивает:

- **Консистентный дизайн** во всем приложении
- **Современный интерфейс** в стиле Microsoft Teams
- **Высокую производительность** и доступность
- **Легкость разработки** с готовыми компонентами
- **Адаптивность** для всех устройств

Использование этого UI кита значительно упрощает разработку и обеспечивает профессиональный внешний вид приложения. 