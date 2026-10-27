import { AxiosError, AxiosHeaders } from 'axios'

import type {
  TOrderDto,
  TOrderListItemDto,
  TOrdersPageDto,
  TOrdersQueryDto,
} from './order.dto'

type TNonEmpty<T> = [T, ...T[]]

function pick<T>(list: TNonEmpty<T>, index: number): T {
  return list[index % list.length] ?? list[0]
}

const CUSTOMERS: TNonEmpty<{ name: string; phone: string; address: string }> = [
  {
    name: 'Иван Петров',
    phone: '79991234567',
    address: 'Самара, ул. Ленина, 10, кв. 5',
  },
  {
    name: 'ООО «Ромашка»',
    phone: '79270001122',
    address: 'Самара, Московское ш., 4, офис 12',
  },
  {
    name: 'Анна Смирнова',
    phone: '79375554433',
    address: 'Тольятти, ул. Мира, 21',
  },
  {
    name: 'ИП Козлов А. В.',
    phone: '79171112233',
    address: 'Самара, ул. Гагарина, 88',
  },
  {
    name: 'Мария Иванова',
    phone: '79053334455',
    address: 'Сызрань, ул. Советская, 3',
  },
  {
    name: 'ООО «Вектор»',
    phone: '78462009090',
    address: 'Самара, пр. Кирова, 150, склад 2',
  },
]

const PRODUCTS: TNonEmpty<{ sku: string; name: string; price: number }> = [
  { sku: 'JKT-001', name: 'Ветровка мужская', price: 3490 },
  { sku: 'TSH-002', name: 'Футболка базовая', price: 990 },
  { sku: 'HD-003', name: 'Худи оверсайз', price: 2790 },
  { sku: 'PHN-001', name: 'Смартфон X1', price: 18990 },
  { sku: 'EAR-004', name: 'Наушники беспроводные', price: 4590 },
  { sku: 'CBL-010', name: 'Кабель USB-C', price: 490 },
]

const STATUSES: TNonEmpty<string> = [
  'New',
  'New',
  'Confirmed',
  'Assembled',
  'Shipped',
  'Delivered',
  'Delivered',
  'Cancelled',
]

const HOUR = 60 * 60 * 1000
const LAST_ORDER_DATE = Date.UTC(2026, 9, 27, 9, 30)

const mockId = (prefix: string, index: number) =>
  `${prefix}-0000-0000-0000-${String(index + 1).padStart(12, '0')}`

const ORDERS_MOCK: TOrderDto[] = Array.from({ length: 27 }, (_, index) => {
  const customer = pick(CUSTOMERS, index)
  const status = pick(STATUSES, index)
  const createdAt = LAST_ORDER_DATE - index * 9 * HOUR

  const items = Array.from({ length: (index % 4) + 1 }, (_, position) => {
    const productIndex = index + position
    const product = pick(PRODUCTS, productIndex)
    const quantity = (productIndex % 3) + 1

    return {
      productId: mockId('00000000', productIndex % PRODUCTS.length),
      sku: product.sku,
      productName: product.name,
      quantity,
      price: product.price,
      sum: product.price * quantity,
    }
  })

  return {
    id: mockId('11111111', index),
    number: 1027 - index,
    customerId: mockId('22222222', index % CUSTOMERS.length),
    customerName: customer.name,
    customerPhone: customer.phone,
    status,
    deliveryAddress: customer.address,
    totalAmount: items.reduce((sum, item) => sum + item.sum, 0),
    createdAt: new Date(createdAt).toISOString(),
    updatedAt:
      status === 'New' ? null : new Date(createdAt + 5 * HOUR).toISOString(),
    items,
  }
})

function toListItem(order: TOrderDto): TOrderListItemDto {
  return {
    id: order.id,
    number: order.number,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    status: order.status,
    totalAmount: order.totalAmount,
    itemsCount: order.items.length,
    createdAt: order.createdAt,
  }
}

function withDelay<T>(getValue: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(getValue())
      } catch (error) {
        reject(error)
      }
    }, 300)
  })
}

export function getOrdersMock(query: TOrdersQueryDto): Promise<TOrdersPageDto> {
  const search = query.search?.toLowerCase() ?? ''
  const digits = search.replace(/\D/g, '')

  const found = ORDERS_MOCK.filter((order) => {
    if (query.status && order.status !== query.status) return false
    if (!search) return true

    return (
      order.customerName?.toLowerCase().includes(search) ||
      (digits.length > 0 &&
        (String(order.number).includes(digits) ||
          order.customerPhone?.includes(digits)))
    )
  })

  const start = (query.page - 1) * query.limit

  return withDelay(() => ({
    data: found.slice(start, start + query.limit).map(toListItem),
    meta: {
      page: query.page,
      limit: query.limit,
      total: found.length,
      totalPages: Math.ceil(found.length / query.limit),
    },
  }))
}

export function getOrderByIdMock(orderId: string): Promise<TOrderDto> {
  return withDelay(() => {
    const order = ORDERS_MOCK.find((item) => item.id === orderId)
    if (order) return order

    throw new AxiosError(
      'Not Found',
      AxiosError.ERR_BAD_REQUEST,
      undefined,
      undefined,
      {
        status: 404,
        statusText: 'Not Found',
        data: { title: 'Заказ не найден' },
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    )
  })
}
