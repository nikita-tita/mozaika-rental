'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Если items не переданы, генерируем автоматически на основе pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Главная', href: '/', current: paths.length === 0 }
    ]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      
      // Преобразуем путь в читаемое название
      let name = path
      switch (path) {
        case 'dashboard':
          name = 'Дашборд'
          break
        case 'properties':
          name = 'Объекты'
          break
        case 'contracts':
          name = 'Договоры'
          break
        case 'bookings':
          name = 'Бронирования'
          break
        case 'payments':
          name = 'Платежи'
          break
        case 'notifications':
          name = 'Уведомления'
          break
        case 'login':
          name = 'Вход'
          break
        case 'register':
          name = 'Регистрация'
          break
        case 'mosaic':
          name = 'Конструктор'
          break
        case 'new':
          name = 'Создать'
          break
        default:
          // Если это ID, показываем "Детали"
          if (/^\d+$/.test(path)) {
            name = 'Детали'
          } else {
            // Капитализируем первую букву
            name = path.charAt(0).toUpperCase() + path.slice(1)
          }
      }

      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === paths.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-primary-400 mx-2" />
            )}
            
            {item.current ? (
              <span className="text-primary-900 font-medium">
                {index === 0 ? (
                  <Home className="w-4 h-4" />
                ) : (
                  item.name
                )}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-primary-600 hover:text-brand-600 transition-colors flex items-center"
              >
                {index === 0 ? (
                  <Home className="w-4 h-4" />
                ) : (
                  item.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
} 