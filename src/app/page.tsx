import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Home, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">M²</h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Главная
                </Link>
                <Link href="/properties" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Недвижимость
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  О нас
                </Link>
              </div>
            </nav>
            <div className="flex space-x-2">
              <Link href="/login" className="btn-secondary">
                Войти
              </Link>
              <Link href="/register" className="btn-primary">
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Найдите свой
            <span className="text-primary-600"> идеальный дом</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Современная платформа для поиска и аренды недвижимости. 
            Тысячи проверенных объектов от надежных арендодателей.
          </p>
        </div>

        {/* Search Section */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Местоположение
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    placeholder="Введите адрес или район"
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Тип недвижимости
                </label>
                <select
                  id="property-type"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option>Все типы</option>
                  <option>Квартира</option>
                  <option>Дом</option>
                  <option>Студия</option>
                  <option>Коммерческая</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Поиск
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Почему выбирают M²?
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Home className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Проверенные объекты</h3>
              <p className="text-gray-600">
                Все объекты недвижимости проходят тщательную проверку перед публикацией
              </p>
            </div>
            <div className="card text-center">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Надежные арендодатели</h3>
              <p className="text-gray-600">
                Работаем только с проверенными арендодателями с положительными отзывами
              </p>
            </div>
            <div className="card text-center">
              <Search className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Удобный поиск</h3>
              <p className="text-gray-600">
                Мощная система поиска с фильтрами поможет найти идеальный вариант
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">M²</h3>
            <p className="text-gray-400">
              © 2024 M² Платформа аренды недвижимости. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}