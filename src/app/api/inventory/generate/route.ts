import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || (user.role !== 'REALTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { inventoryItems, propertyData } = body

    // Генерируем акт приема-передачи
    const actContent = generateInventoryAct(inventoryItems, propertyData)
    
    // Создаем файл для скачивания
    const fileName = `Акт_приема-передачи_имущества_${propertyData?.title?.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_') || 'объект'}_${new Date().toISOString().split('T')[0]}.txt`
    
    return NextResponse.json({
      success: true,
      data: {
        id: `inventory_${Date.now()}`,
        title: 'Акт приема-передачи имущества',
        content: actContent,
        fileName: fileName,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Ошибка генерации акта:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function generateInventoryAct(items: any[], propertyData?: any): string {
  const today = new Date().toLocaleDateString('ru-RU')
  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0)
  
  return `АКТ ПРИЕМА-ПЕРЕДАЧИ ИМУЩЕСТВА

г. Москва                                                                  ${today}

${propertyData?.landlordName || 'Арендодатель'}, именуемый в дальнейшем "Арендодатель", с одной стороны, и ${propertyData?.tenantName || 'Арендатор'}, именуемый в дальнейшем "Арендатор", с другой стороны, составили настоящий акт о нижеследующем:

1. ОБЪЕКТ НЕДВИЖИМОСТИ
1.1. Адрес объекта: ${propertyData?.address || 'Не указан'}
1.2. Тип объекта: ${propertyData?.type || 'Не указан'}
1.3. Площадь: ${propertyData?.area || 'Не указана'} кв.м

2. ПЕРЕДАВАЕМОЕ ИМУЩЕСТВО
2.1. Арендодатель передает, а Арендатор принимает следующее имущество:

${items.map((item, index) => `${index + 1}. ${item.name}
   - Состояние: ${getConditionText(item.condition)}
   - Категория: ${item.category}
   - Описание: ${item.description}
   - Оценочная стоимость: ${item.estimatedValue.toLocaleString()} ₽
   - Точность определения: ${item.confidence}%`).join('\n\n')}

3. ОБЩАЯ СТОИМОСТЬ ИМУЩЕСТВА
3.1. Общая оценочная стоимость передаваемого имущества составляет: ${totalValue.toLocaleString()} ₽

4. УСЛОВИЯ ПЕРЕДАЧИ
4.1. Имущество передается в состоянии, соответствующем описанию в настоящем акте.
4.2. Арендатор обязуется:
   - Бережно относиться к переданному имуществу
   - Использовать имущество по назначению
   - Возвратить имущество в том же состоянии при расторжении договора
   - Возместить ущерб в случае порчи или утраты имущества

5. ОСОБЫЕ ОТМЕТКИ
5.1. Настоящий акт составлен в двух экземплярах, имеющих равную юридическую силу.
5.2. Акт является неотъемлемой частью договора аренды.
5.3. Все изменения в составе имущества должны оформляться дополнительными актами.

6. ПОДПИСИ СТОРОН
Арендодатель: ${propertyData?.landlordName || '_________________'}
Подпись: _________________                               Дата: ${today}

Арендатор: ${propertyData?.tenantName || '_________________'}
Подпись: _________________                               Дата: ${today}

Акт составлен и подписан ${today} года в г. Москва.

Примечание: Данный акт составлен на основе автоматического анализа фотографий помещения с использованием ИИ-технологий. Рекомендуется проверить точность описания имущества при подписании.`
}

function getConditionText(condition: string): string {
  switch (condition) {
    case 'excellent': return 'Отличное'
    case 'good': return 'Хорошее'
    case 'fair': return 'Удовлетворительное'
    case 'poor': return 'Плохое'
    default: return 'Не указано'
  }
} 