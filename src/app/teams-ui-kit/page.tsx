'use client'

import React, { useState } from 'react'
import {
  TeamsButton,
  TeamsInput,
  TeamsSelect,
  TeamsCard,
  TeamsModal,
  TeamsTable,
  TeamsTableHeader,
  TeamsTableBody,
  TeamsTableRow,
  TeamsTableCell,
  TeamsTableHeaderCell,
  TeamsBadge,
  TeamsTabs,
  TeamsAlert,
  TeamsTooltip,
  teamsTheme
} from '@/components/ui/teams'

export default function TeamsUIKitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('buttons')

  const selectOptions = [
    { value: 'option1', label: 'Опция 1' },
    { value: 'option2', label: 'Опция 2' },
    { value: 'option3', label: 'Опция 3', disabled: true },
  ]

  const tableData = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', status: 'Активен' },
    { id: 2, name: 'Мария Петрова', email: 'maria@example.com', status: 'Неактивен' },
    { id: 3, name: 'Алексей Сидоров', email: 'alex@example.com', status: 'Активен' },
  ]

  const tabs = [
    {
      id: 'buttons',
      label: 'Кнопки',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Варианты кнопок</h3>
            <div className="flex flex-wrap gap-4">
              <TeamsButton variant="primary">Primary</TeamsButton>
              <TeamsButton variant="secondary">Secondary</TeamsButton>
              <TeamsButton variant="outline">Outline</TeamsButton>
              <TeamsButton variant="ghost">Ghost</TeamsButton>
              <TeamsButton variant="danger">Danger</TeamsButton>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Размеры кнопок</h3>
            <div className="flex flex-wrap items-center gap-4">
              <TeamsButton size="sm">Small</TeamsButton>
              <TeamsButton size="md">Medium</TeamsButton>
              <TeamsButton size="lg">Large</TeamsButton>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Кнопки с иконками</h3>
            <div className="flex flex-wrap gap-4">
              <TeamsButton icon={<span>📧</span>}>С иконкой слева</TeamsButton>
              <TeamsButton icon={<span>➡️</span>} iconPosition="right">С иконкой справа</TeamsButton>
              <TeamsButton loading>Загрузка</TeamsButton>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'forms',
      label: 'Формы',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Поля ввода</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Обычное поле</label>
                <TeamsInput placeholder="Введите текст..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Поле с ошибкой</label>
                <TeamsInput placeholder="Ошибка" error />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Отключенное поле</label>
                <TeamsInput placeholder="Отключено" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select</label>
                <TeamsSelect options={selectOptions} placeholder="Выберите опцию" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data',
      label: 'Данные',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Бейджи</h3>
            <div className="flex flex-wrap gap-2">
              <TeamsBadge variant="default">Default</TeamsBadge>
              <TeamsBadge variant="primary">Primary</TeamsBadge>
              <TeamsBadge variant="success">Success</TeamsBadge>
              <TeamsBadge variant="warning">Warning</TeamsBadge>
              <TeamsBadge variant="error">Error</TeamsBadge>
              <TeamsBadge variant="info">Info</TeamsBadge>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Таблица</h3>
            <TeamsTable>
              <TeamsTableHeader>
                <tr>
                  <TeamsTableHeaderCell>ID</TeamsTableHeaderCell>
                  <TeamsTableHeaderCell>Имя</TeamsTableHeaderCell>
                  <TeamsTableHeaderCell>Email</TeamsTableHeaderCell>
                  <TeamsTableHeaderCell>Статус</TeamsTableHeaderCell>
                </tr>
              </TeamsTableHeader>
              <TeamsTableBody>
                {tableData.map((row) => (
                  <TeamsTableRow key={row.id} onClick={() => console.log('Row clicked:', row.id)}>
                    <TeamsTableCell>{row.id}</TeamsTableCell>
                    <TeamsTableCell>{row.name}</TeamsTableCell>
                    <TeamsTableCell>{row.email}</TeamsTableCell>
                    <TeamsTableCell>
                      <TeamsBadge variant={row.status === 'Активен' ? 'success' : 'default'}>
                        {row.status}
                      </TeamsBadge>
                    </TeamsTableCell>
                  </TeamsTableRow>
                ))}
              </TeamsTableBody>
            </TeamsTable>
          </div>
        </div>
      )
    },
    {
      id: 'feedback',
      label: 'Обратная связь',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Алерты</h3>
            <div className="space-y-4">
              <TeamsAlert variant="info" title="Информация">
                Это информационное сообщение с заголовком.
              </TeamsAlert>
              <TeamsAlert variant="success" title="Успех">
                Операция выполнена успешно!
              </TeamsAlert>
              <TeamsAlert variant="warning" title="Предупреждение">
                Внимание! Это предупреждающее сообщение.
              </TeamsAlert>
              <TeamsAlert variant="error" title="Ошибка">
                Произошла ошибка при выполнении операции.
              </TeamsAlert>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Тултипы</h3>
            <div className="flex flex-wrap gap-4">
              <TeamsTooltip content="Тултип сверху" position="top">
                <TeamsButton>Hover me (top)</TeamsButton>
              </TeamsTooltip>
              <TeamsTooltip content="Тултип снизу" position="bottom">
                <TeamsButton>Hover me (bottom)</TeamsButton>
              </TeamsTooltip>
              <TeamsTooltip content="Тултип слева" position="left">
                <TeamsButton>Hover me (left)</TeamsButton>
              </TeamsTooltip>
              <TeamsTooltip content="Тултип справа" position="right">
                <TeamsButton>Hover me (right)</TeamsButton>
              </TeamsTooltip>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Модальное окно</h3>
            <TeamsButton onClick={() => setIsModalOpen(true)}>
              Открыть модальное окно
            </TeamsButton>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Microsoft Teams UI Kit
          </h1>
          <p className="text-gray-600">
            Полный набор компонентов в стиле Microsoft Teams для вашего приложения
          </p>
        </div>

        <TeamsTabs
          tabs={tabs}
          defaultTab="buttons"
          onChange={setSelectedTab}
        />

        <TeamsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Пример модального окна"
          footer={
            <>
              <TeamsButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                Отмена
              </TeamsButton>
              <TeamsButton onClick={() => setIsModalOpen(false)}>
                Подтвердить
              </TeamsButton>
            </>
          }
        >
          <p className="text-gray-600">
            Это пример модального окна в стиле Microsoft Teams. Здесь может быть любой контент.
          </p>
        </TeamsModal>
      </div>
    </div>
  )
} 