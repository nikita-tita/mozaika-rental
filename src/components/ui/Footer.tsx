import Link from 'next/link'
import { Building2, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-accent-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">M²</h3>
                <p className="text-sm text-primary-300">Технологии для риелторов</p>
              </div>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed mb-4">
              Профессиональные инструменты для упрощения работы риелторов и автоматизации документооборота.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-primary-300">
                <Phone className="w-4 h-4" />
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-300">
                <Mail className="w-4 h-4" />
                <span>info@m2.ru</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-300">
                <MapPin className="w-4 h-4" />
                <span>Москва, ул. Примерная, 123</span>
              </div>
            </div>
          </div>

          {/* Продукт */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Продукт</h4>
            <ul className="space-y-3 text-primary-300">
              <li>
                <Link href="/mosaic" className="hover:text-white transition-colors">
                  Конструктор договоров
                </Link>
              </li>
              <li>
                <Link href="/mosaic" className="hover:text-white transition-colors">
                  Скоринг арендаторов
                </Link>
              </li>
              <li>
                <Link href="/mosaic" className="hover:text-white transition-colors">
                  Опись имущества
                </Link>
              </li>
              <li>
                <Link href="/mosaic" className="hover:text-white transition-colors">
                  Электронная подпись
                </Link>
              </li>
              <li>
                <Link href="/mosaic" className="hover:text-white transition-colors">
                  Мультилистинг
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Поддержка</h4>
            <ul className="space-y-3 text-primary-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Центр поддержки
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Документация
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Видеоуроки
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Компания</h4>
            <ul className="space-y-3 text-primary-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Карьера
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Партнеры
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Пресс-центр
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-12 pt-8 border-t border-primary-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-primary-400">
              <p>&copy; {new Date().getFullYear()} M². Все права защищены.</p>
            </div>
            <div className="flex space-x-6 text-sm text-primary-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Условия использования
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 