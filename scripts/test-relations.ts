import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testRelations() {
  try {
    // 1. Создаем клиента
    const client = await prisma.client.create({
      data: {
        firstName: 'Тест',
        lastName: 'Тестов',
        phone: '+7999999999',
        type: 'TENANT',
        user: {
          connect: {
            // ID существующего риелтора
            id: 'cmdzrcwwo0000u19qfgph9edv'
          }
        }
      }
    })
    console.log('Создан клиент:', client)

    // 2. Создаем объект
    const property = await prisma.property.create({
      data: {
        title: 'Тестовая квартира',
        type: 'APARTMENT',
        address: 'ул. Тестовая, 1',
        price: 50000,
        user: {
          connect: {
            id: 'cmdzrcwwo0000u19qfgph9edv'
          }
        }
      }
    })
    console.log('Создан объект:', property)

    // 3. Создаем сделку, связывающую клиента и объект
    const deal = await prisma.deal.create({
      data: {
        title: 'Тестовая сделка',
        status: 'NEW',
        client: {
          connect: {
            id: client.id
          }
        },
        property: {
          connect: {
            id: property.id
          }
        },
        user: {
          connect: {
            id: 'cmdzrcwwo0000u19qfgph9edv'
          }
        }
      },
      include: {
        client: true,
        property: true
      }
    })
    console.log('Создана сделка:', deal)

    // 4. Создаем договор на основе сделки
    const contract = await prisma.contract.create({
      data: {
        title: 'Договор аренды',
        status: 'DRAFT',
        content: JSON.stringify({
          clientId: client.id,
          clientName: `${client.firstName} ${client.lastName}`,
          propertyId: property.id,
          propertyAddress: property.address,
          dealId: deal.id
        }),
        user: {
          connect: {
            id: 'cmdzrcwwo0000u19qfgph9edv'
          }
        }
      }
    })
    console.log('Создан договор:', contract)

    // 5. Проверяем связи - получаем сделку со всеми связанными данными
    const fullDeal = await prisma.deal.findUnique({
      where: {
        id: deal.id
      },
      include: {
        client: true,
        property: true,
        user: true
      }
    })
    console.log('Полные данные сделки:', fullDeal)

  } catch (error) {
    console.error('Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRelations()