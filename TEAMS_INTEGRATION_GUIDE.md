# Руководство по интеграции Microsoft Teams UI Kit

## Обзор

Мы создали полный UI Kit в стиле Microsoft Teams для вашего приложения Mozaika. Этот набор компонентов обеспечивает современный, профессиональный интерфейс, соответствующий стандартам Microsoft Teams.

## Что было создано

### 🎨 Компоненты Teams UI Kit

1. **TeamsButton** - Кнопки с различными вариантами и размерами
2. **TeamsInput** - Поля ввода с валидацией
3. **TeamsSelect** - Выпадающие списки
4. **TeamsCard** - Карточки для группировки контента
5. **TeamsModal** - Модальные окна
6. **TeamsTable** - Таблицы с сортировкой
7. **TeamsBadge** - Бейджи для статусов
8. **TeamsTabs** - Вкладки
9. **TeamsAlert** - Уведомления и алерты
10. **TeamsTooltip** - Тултипы

### 📁 Структура файлов

```
src/components/ui/teams/
├── TeamsTheme.tsx          # Тема и стили
├── TeamsButton.tsx         # Кнопки
├── TeamsInput.tsx          # Поля ввода
├── TeamsSelect.tsx         # Выпадающие списки
├── TeamsCard.tsx           # Карточки
├── TeamsModal.tsx          # Модальные окна
├── TeamsTable.tsx          # Таблицы
├── TeamsBadge.tsx          # Бейджи
├── TeamsTabs.tsx           # Вкладки
├── TeamsAlert.tsx          # Алерты
├── TeamsTooltip.tsx        # Тултипы
└── index.ts                # Экспорты
```

### 🎯 Демонстрационные страницы

- `/teams-ui-kit` - Полная демонстрация всех компонентов
- `/dashboard-teams` - Пример интеграции в dashboard

## Как использовать

### 1. Импорт компонентов

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
  teamsTheme
} from '@/components/ui/teams'
```

### 2. Замена существующих компонентов

#### Было:
```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary" onClick={handleClick}>
  Нажми меня
</Button>
```

#### Стало:
```tsx
import { TeamsButton } from '@/components/ui/teams'

<TeamsButton variant="primary" onClick={handleClick}>
  Нажми меня
</TeamsButton>
```

### 3. Использование темы

```typescript
import { teamsTheme } from '@/components/ui/teams'

// Цвета Microsoft Teams
const primaryColor = teamsTheme.colors.teams.blue // #0078d4
const backgroundColor = teamsTheme.colors.teams.grayLight // #faf9f8

// Размеры
const spacing = teamsTheme.spacing.md // 16px
const borderRadius = teamsTheme.borderRadius.lg // 8px
```

## Примеры использования

### Кнопки

```tsx
// Различные варианты
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
<TeamsButton icon={<Plus />} iconPosition="left">
  Добавить
</TeamsButton>

// Состояние загрузки
<TeamsButton loading>Загрузка...</TeamsButton>
```

### Формы

```tsx
// Поле ввода
<TeamsInput 
  placeholder="Введите текст..."
  error={hasError}
  disabled={isDisabled}
/>

// Выпадающий список
const options = [
  { value: 'option1', label: 'Опция 1' },
  { value: 'option2', label: 'Опция 2' },
]

<TeamsSelect
  options={options}
  value={selectedValue}
  onChange={handleChange}
  placeholder="Выберите опцию"
/>
```

### Таблицы

```tsx
<TeamsTable>
  <TeamsTableHeader>
    <tr>
      <TeamsTableHeaderCell>ID</TeamsTableHeaderCell>
      <TeamsTableHeaderCell>Имя</TeamsTableHeaderCell>
      <TeamsTableHeaderCell>Email</TeamsTableHeaderCell>
    </tr>
  </TeamsTableHeader>
  <TeamsTableBody>
    {data.map((row) => (
      <TeamsTableRow key={row.id} onClick={() => handleRowClick(row)}>
        <TeamsTableCell>{row.id}</TeamsTableCell>
        <TeamsTableCell>{row.name}</TeamsTableCell>
        <TeamsTableCell>{row.email}</TeamsTableCell>
      </TeamsTableRow>
    ))}
  </TeamsTableBody>
</TeamsTable>
```

### Модальные окна

```tsx
const [isOpen, setIsOpen] = useState(false)

<TeamsModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Заголовок"
  size="lg"
  footer={
    <>
      <TeamsButton variant="secondary" onClick={() => setIsOpen(false)}>
        Отмена
      </TeamsButton>
      <TeamsButton onClick={handleConfirm}>
        Подтвердить
      </TeamsButton>
    </>
  }
>
  <p>Содержимое модального окна</p>
</TeamsModal>
```

## Пошаговая интеграция

### Шаг 1: Оценка текущего интерфейса

1. Определите основные страницы для обновления
2. Составьте список используемых компонентов
3. Определите приоритеты обновления

### Шаг 2: Постепенная замена

1. Начните с простых компонентов (кнопки, поля ввода)
2. Обновите страницы по одной
3. Тестируйте каждое изменение

### Шаг 3: Обновление сложных компонентов

1. Замените таблицы на TeamsTable
2. Добавьте модальные окна TeamsModal
3. Интегрируйте вкладки TeamsTabs

### Шаг 4: Финальная настройка

1. Проверьте консистентность дизайна
2. Настройте цвета и темы
3. Протестируйте на разных устройствах

## Рекомендации

### 🎨 Дизайн

- Используйте цвета из `teamsTheme.colors.teams`
- Следуйте принципам Microsoft Fluent Design
- Обеспечьте достаточный контраст для доступности

### 📱 Адаптивность

- Все компоненты адаптивны по умолчанию
- Используйте Tailwind CSS классы для дополнительной настройки
- Тестируйте на мобильных устройствах

### ♿ Доступность

- Компоненты включают ARIA атрибуты
- Поддерживают навигацию с клавиатуры
- Обеспечивают достаточный контраст

### 🚀 Производительность

- Компоненты оптимизированы для React
- Используют мемоизацию где необходимо
- Минимальный размер бандла

## Миграция существующих страниц

### Пример: Dashboard

Сравните `/dashboard` (старая версия) и `/dashboard-teams` (новая версия):

**Основные изменения:**
- Замена Button на TeamsButton
- Использование TeamsCard для статистики
- Добавление TeamsTable для активности
- Интеграция TeamsTabs для организации контента
- Использование TeamsAlert для уведомлений

### План миграции

1. **Неделя 1**: Обновить основные компоненты (кнопки, поля ввода)
2. **Неделя 2**: Заменить таблицы и карточки
3. **Неделя 3**: Добавить модальные окна и вкладки
4. **Неделя 4**: Финальная настройка и тестирование

## Поддержка и обновления

- Все компоненты документированы в `TEAMS_UI_KIT.md`
- Демонстрация доступна на `/teams-ui-kit`
- Код готов к продакшену
- Легко расширяется новыми компонентами

## Заключение

Microsoft Teams UI Kit предоставляет современный, профессиональный интерфейс для вашего приложения Mozaika. Компоненты готовы к использованию и легко интегрируются в существующий код.

Начните с демонстрационной страницы `/teams-ui-kit` и постепенно обновляйте интерфейс вашего приложения! 