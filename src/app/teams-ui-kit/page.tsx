'use client'

import { useState } from 'react'
import { 
  TeamsButton, 
  TeamsInput, 
  TeamsSelect, 
  TeamsCard, 
  TeamsModal, 
  TeamsAlert, 
  TeamsBadge, 
  TeamsTabs,
  TeamsAutocomplete,
  TeamsAddressInput
} from '@/components/ui/teams'
import { 
  Home, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Search,
  Plus,
  Edit,
  Trash,
  Eye
} from 'lucide-react'

export default function TeamsUIKitPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedStreet, setSelectedStreet] = useState('')
  const [address, setAddress] = useState({})

  const cityOptions = [
    { value: 'Москва', label: 'Москва', description: 'Московская область • 12,5 млн чел.' },
    { value: 'Санкт-Петербург', label: 'Санкт-Петербург', description: 'Ленинградская область • 5,4 млн чел.' },
    { value: 'Новосибирск', label: 'Новосибирск', description: 'Новосибирская область • 1,6 млн чел.' },
    { value: 'Екатеринбург', label: 'Екатеринбург', description: 'Свердловская область • 1,5 млн чел.' },
    { value: 'Казань', label: 'Казань', description: 'Республика Татарстан • 1,3 млн чел.' },
  ]

  const streetOptions = [
    { value: 'Тверская улица', label: 'Тверская улица', description: 'Центральный округ • улица' },
    { value: 'Арбат', label: 'Арбат', description: 'Центральный округ • улица' },
    { value: 'Кутузовский проспект', label: 'Кутузовский проспект', description: 'Западный округ • проспект' },
    { value: 'Ленинский проспект', label: 'Ленинский проспект', description: 'Юго-Западный округ • проспект' },
    { value: 'Красная площадь', label: 'Красная площадь', description: 'Центральный округ • площадь' },
  ]

  const tabs = [
    {
      id: 'basic',
      label: 'Базовые компоненты',
      content: (
        <div className="space-y-6">
          {/* Buttons */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Кнопки</h3>
            <div className="flex flex-wrap gap-3">
              <TeamsButton>Primary</TeamsButton>
              <TeamsButton variant="secondary">Secondary</TeamsButton>
              <TeamsButton variant="outline">Outline</TeamsButton>
              <TeamsButton variant="ghost">Ghost</TeamsButton>
              <TeamsButton variant="danger">Danger</TeamsButton>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <TeamsButton size="sm">Small</TeamsButton>
              <TeamsButton size="md">Medium</TeamsButton>
              <TeamsButton size="lg">Large</TeamsButton>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <TeamsButton loading>Loading</TeamsButton>
              <TeamsButton disabled>Disabled</TeamsButton>
              <TeamsButton icon={<Plus className="h-4 w-4" />}>With Icon</TeamsButton>
            </div>
          </TeamsCard>

          {/* Inputs */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Поля ввода</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TeamsInput
                label="Обычное поле"
                placeholder="Введите текст..."
                icon={<User className="h-4 w-4" />}
              />
              <TeamsInput
                label="Email"
                type="email"
                placeholder="email@example.com"
                icon={<Mail className="h-4 w-4" />}
              />
              <TeamsInput
                label="Телефон"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                icon={<Phone className="h-4 w-4" />}
              />
              <TeamsInput
                label="С ошибкой"
                placeholder="Поле с ошибкой"
                error="Это поле обязательно для заполнения"
              />
            </div>
          </TeamsCard>

          {/* Select */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Выпадающие списки</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TeamsSelect
                options={[
                  { value: '', label: 'Выберите город' },
                  { value: 'moscow', label: 'Москва' },
                  { value: 'spb', label: 'Санкт-Петербург' },
                  { value: 'novosibirsk', label: 'Новосибирск' },
                ]}
                placeholder="Выберите город"
              />
              <TeamsSelect
                options={[
                  { value: '', label: 'Выберите тип' },
                  { value: 'apartment', label: 'Квартира' },
                  { value: 'house', label: 'Дом' },
                  { value: 'room', label: 'Комната' },
                ]}
                placeholder="Тип недвижимости"
              />
            </div>
          </TeamsCard>
        </div>
      )
    },
    {
      id: 'advanced',
      label: 'Продвинутые компоненты',
      content: (
        <div className="space-y-6">
          {/* Autocomplete */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Автодополнение</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Поиск города
                </label>
                <TeamsAutocomplete
                  options={cityOptions}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="Начните вводить название города..."
                  allowCustom={true}
                  maxResults={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Поиск улицы
                </label>
                <TeamsAutocomplete
                  options={streetOptions}
                  value={selectedStreet}
                  onChange={setSelectedStreet}
                  placeholder="Начните вводить название улицы..."
                  allowCustom={true}
                  maxResults={10}
                />
              </div>
            </div>
          </TeamsCard>

          {/* Address Input */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Ввод адреса</h3>
            <TeamsAddressInput
              value={address}
              onChange={setAddress}
              showFullAddress={true}
            />
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Выбранный адрес:</strong> {JSON.stringify(address, null, 2)}
              </p>
            </div>
          </TeamsCard>

          {/* Modal */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Модальные окна</h3>
            <TeamsButton onClick={() => setShowModal(true)}>
              Открыть модальное окно
            </TeamsButton>
          </TeamsCard>

          {/* Alerts */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Уведомления</h3>
            <div className="space-y-3">
              <TeamsAlert variant="info" title="Информация">
                Это информационное сообщение с заголовком.
              </TeamsAlert>
              <TeamsAlert variant="success" title="Успех">
                Операция выполнена успешно!
              </TeamsAlert>
              <TeamsAlert variant="warning" title="Предупреждение">
                Обратите внимание на эту информацию.
              </TeamsAlert>
              <TeamsAlert variant="error" title="Ошибка">
                Произошла ошибка при выполнении операции.
              </TeamsAlert>
            </div>
          </TeamsCard>

          {/* Badges */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Бейджи</h3>
            <div className="flex flex-wrap gap-3">
              <TeamsBadge variant="default">Default</TeamsBadge>
              <TeamsBadge variant="primary">Primary</TeamsBadge>
              <TeamsBadge variant="success">Success</TeamsBadge>
              <TeamsBadge variant="warning">Warning</TeamsBadge>
              <TeamsBadge variant="error">Error</TeamsBadge>
              <TeamsBadge variant="info">Info</TeamsBadge>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <TeamsBadge size="sm">Small</TeamsBadge>
              <TeamsBadge size="md">Medium</TeamsBadge>
              <TeamsBadge size="lg">Large</TeamsBadge>
            </div>
          </TeamsCard>
        </div>
      )
    },
    {
      id: 'data',
      label: 'Работа с данными',
      content: (
        <div className="space-y-6">
          {/* Table */}
          <TeamsCard>
            <h3 className="text-lg font-semibold mb-4">Таблицы</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Объект
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адрес
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">3-комнатная квартира</div>
                          <div className="text-sm text-gray-500">ID: 12345</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Москва, ул. Тверская, 15</div>
                      <div className="text-sm text-gray-500">Центральный округ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">120 000 ₽/мес</div>
                      <div className="text-sm text-gray-500">Залог: 1 мес</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TeamsBadge variant="success">Активно</TeamsBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <TeamsButton size="sm" variant="ghost" icon={<Eye className="h-4 w-4" />} />
                        <TeamsButton size="sm" variant="ghost" icon={<Edit className="h-4 w-4" />} />
                        <TeamsButton size="sm" variant="ghost" icon={<Trash className="h-4 w-4" />} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">2-комнатная квартира</div>
                          <div className="text-sm text-gray-500">ID: 12346</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Москва, ул. Арбат, 25</div>
                      <div className="text-sm text-gray-500">Центральный округ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">95 000 ₽/мес</div>
                      <div className="text-sm text-gray-500">Залог: 1 мес</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TeamsBadge variant="warning">На рассмотрении</TeamsBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <TeamsButton size="sm" variant="ghost" icon={<Eye className="h-4 w-4" />} />
                        <TeamsButton size="sm" variant="ghost" icon={<Edit className="h-4 w-4" />} />
                        <TeamsButton size="sm" variant="ghost" icon={<Trash className="h-4 w-4" />} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TeamsCard>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teams UI Kit</h1>
          <p className="text-gray-600 mt-2">
            Библиотека компонентов в стиле Microsoft Teams для платформы M²
          </p>
        </div>

        <TeamsTabs tabs={tabs} defaultTab="basic" />

        {/* Modal */}
        <TeamsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Пример модального окна"
          size="lg"
          footer={
            <div className="flex justify-end space-x-3">
              <TeamsButton variant="outline" onClick={() => setShowModal(false)}>
                Отмена
              </TeamsButton>
              <TeamsButton onClick={() => setShowModal(false)}>
                Подтвердить
              </TeamsButton>
            </div>
          }
        >
          <div className="space-y-4">
            <p>Это пример модального окна с различными компонентами внутри.</p>
            
            <TeamsInput
              label="Название"
              placeholder="Введите название..."
            />
            
            <TeamsSelect
              options={[
                { value: 'option1', label: 'Опция 1' },
                { value: 'option2', label: 'Опция 2' },
                { value: 'option3', label: 'Опция 3' },
              ]}
              placeholder="Выберите опцию"
            />
            
            <TeamsAlert variant="info">
              Это информационное сообщение внутри модального окна.
            </TeamsAlert>
          </div>
        </TeamsModal>
      </div>
    </div>
  )
} 