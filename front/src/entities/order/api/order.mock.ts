import type {
  TOrderListItemDto,
  TOrdersPageDto,
  TOrdersQueryDto,
} from './order.dto'

function pick<T>(list: readonly [T, ...T[]], index: number): T {
  return list[index % list.length] ?? list[0]
}

const CUSTOMERS: [
  { name: string; phone: string },
  ...{ name: string; phone: string }[],
] = [
  { name: 'Иван Петров', phone: '79991234567' },
  { name: 'ООО «Ромашка»', phone: '79270001122' },
  { name: 'Анна Смирнова', phone: '79375554433' },
  { name: 'ИП Козлов А. В.', phone: '79171112233' },
  { name: 'Мария Иванова', phone: '79053334455' },
  { name: 'ООО «Вектор»', phone: '78462009090' },
]

const STATUSES: [string, ...string[]] = [
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

const ORDERS_MOCK: TOrderListItemDto[] = Array.from(
  { length: 27 },
  (_, index) => {
    const customer = pick(CUSTOMERS, index)

    return {
      id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
      number: 1027 - index,
      customerName: customer.name,
      customerPhone: customer.phone,
      status: pick(STATUSES, index),
      totalAmount: ((index * 3170) % 24000) + 1490,
      itemsCount: (index % 4) + 1,
      createdAt: new Date(LAST_ORDER_DATE - index * 9 * HOUR).toISOString(),
    }
  },
)

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

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: found.slice(start, start + query.limit),
          meta: {
            page: query.page,
            limit: query.limit,
            total: found.length,
            totalPages: Math.ceil(found.length / query.limit),
          },
        }),
      300,
    )
  })
}
