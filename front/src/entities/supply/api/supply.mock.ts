import { AxiosError, AxiosHeaders } from 'axios'

import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type {
  TSuppliesPageDto,
  TSuppliesQueryDto,
  TSupplyCreateDto,
  TSupplyDto,
  TSupplyListItemDto,
  TSupplyReceiveDto,
} from './supply.dto'

const SUPPLIER_NAMES: Record<string, string> = {
  '33333333-0000-0000-0000-000000000001': 'ООО «ТекстильПром»',
  '33333333-0000-0000-0000-000000000002': 'ИП Малахова Е. А.',
  '33333333-0000-0000-0000-000000000003': 'ООО «ЭлектроСнаб»',
  '33333333-0000-0000-0000-000000000004': 'ООО «Верхняя одежда»',
}

const SEED: {
  supplierId: string
  status: string
  daysAgo: number
  items: [string, string, number, number][]
}[] = [
  {
    supplierId: '33333333-0000-0000-0000-000000000001',
    status: 'Created',
    daysAgo: 0,
    items: [
      ['TSH-001', 'Футболка хлопковая белая', 40, 450],
      ['SHR-001', 'Шорты спортивные', 20, 600],
    ],
  },
  {
    supplierId: '33333333-0000-0000-0000-000000000003',
    status: 'Created',
    daysAgo: 1,
    items: [['PHN-003', 'Смартфон Xiaomi Redmi Note 13', 5, 15500]],
  },
  {
    supplierId: '33333333-0000-0000-0000-000000000002',
    status: 'Received',
    daysAgo: 3,
    items: [
      ['JKT-002', 'Ветровка непромокаемая', 10, 2100],
      ['JKT-005', 'Бомбер оливковый', 6, 2400],
    ],
  },
  {
    supplierId: '33333333-0000-0000-0000-000000000001',
    status: 'Received',
    daysAgo: 6,
    items: [['TSH-003', 'Футболка с принтом', 30, 700]],
  },
  {
    supplierId: '33333333-0000-0000-0000-000000000004',
    status: 'Cancelled',
    daysAgo: 9,
    items: [['JKT-003', 'Куртка джинсовая', 8, 2900]],
  },
  {
    supplierId: '33333333-0000-0000-0000-000000000003',
    status: 'Received',
    daysAgo: 12,
    items: [
      ['NB-003', 'Ноутбук Apple MacBook Air 13 M2', 2, 89000],
      ['NB-005', 'Ноутбук Acer Aspire 5', 3, 42000],
    ],
  },
]

const DAY = 24 * 60 * 60 * 1000
const TODAY = Date.UTC(2026, 10, 13, 10, 0)

const toDate = (time: number) => new Date(time).toISOString().slice(0, 10)

let supplies: TSupplyDto[] = SEED.map((seed, index) => {
  const createdAt = TODAY - seed.daysAgo * DAY
  const items = seed.items.map(([sku, productName, quantity, price], i) => ({
    productId: `44444444-0000-0000-0000-${String(index * 10 + i).padStart(12, '0')}`,
    sku,
    productName,
    quantity,
    receivedQuantity:
      seed.status === 'Received' ? quantity - (i === 1 ? 1 : 0) : null,
    purchasePrice: price,
    sum: quantity * price,
  }))

  return {
    id: `55555555-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
    number: SEED.length - index,
    supplierId: seed.supplierId,
    supplierName: SUPPLIER_NAMES[seed.supplierId] ?? null,
    status: seed.status,
    expectedDate: toDate(createdAt + 3 * DAY),
    comment: null,
    totalAmount: items.reduce((sum, item) => sum + item.sum, 0),
    createdAt: new Date(createdAt).toISOString(),
    receivedAt:
      seed.status === 'Received'
        ? new Date(createdAt + 2 * DAY).toISOString()
        : null,
    items,
  }
})

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

function mockApiError(status: number, title: string): AxiosError {
  return new AxiosError(
    title,
    AxiosError.ERR_BAD_REQUEST,
    undefined,
    undefined,
    {
      status,
      statusText: title,
      data: { title },
      headers: {},
      config: { headers: new AxiosHeaders() },
    },
  )
}

function findSupply(supplyId: string): TSupplyDto {
  const supply = supplies.find((item) => item.id === supplyId)
  if (!supply) throw mockApiError(404, 'Поставка не найдена')
  return supply
}

async function loadProductNames(productIds: string[]) {
  const entries = await Promise.all(
    productIds.map(async (productId) => {
      try {
        const { data } = await apiClient.get<{ sku: string; name: string }>(
          API_ENDPOINTS.products.byId(productId),
        )
        return [productId, { sku: data.sku, name: data.name }] as const
      } catch {
        return [productId, null] as const
      }
    }),
  )

  return new Map(entries)
}

function toListItem(supply: TSupplyDto): TSupplyListItemDto {
  return {
    id: supply.id,
    number: supply.number,
    supplierName: supply.supplierName,
    status: supply.status,
    expectedDate: supply.expectedDate,
    itemsCount: supply.items.length,
    totalAmount: supply.totalAmount,
    createdAt: supply.createdAt,
  }
}

export function getSuppliesMock(
  query: TSuppliesQueryDto,
): Promise<TSuppliesPageDto> {
  const search = query.search?.toLowerCase() ?? ''
  const digits = search.replace(/\D/g, '')

  const found = supplies.filter((supply) => {
    if (query.status && supply.status !== query.status) return false
    if (!search) return true

    return (
      (supply.supplierName?.toLowerCase().includes(search) ?? false) ||
      (digits.length > 0 && String(supply.number).includes(digits))
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

export async function createSupplyMock(
  dto: TSupplyCreateDto,
): Promise<TSupplyDto> {
  const names = await loadProductNames(dto.items.map((item) => item.productId))

  return withDelay(() => {
    const items = dto.items.map((item) => ({
      ...item,
      sku: names.get(item.productId)?.sku ?? null,
      productName: names.get(item.productId)?.name ?? null,
      receivedQuantity: null,
      sum: item.quantity * item.purchasePrice,
    }))

    const supply: TSupplyDto = {
      id: crypto.randomUUID(),
      number: Math.max(0, ...supplies.map((item) => item.number)) + 1,
      supplierId: dto.supplierId,
      supplierName: SUPPLIER_NAMES[dto.supplierId] ?? null,
      status: 'Created',
      expectedDate: dto.expectedDate,
      comment: dto.comment,
      totalAmount: items.reduce((sum, item) => sum + item.sum, 0),
      createdAt: new Date().toISOString(),
      receivedAt: null,
      items,
    }
    supplies = [supply, ...supplies]

    return supply
  })
}

export function getSupplyByIdMock(supplyId: string): Promise<TSupplyDto> {
  return withDelay(() => findSupply(supplyId))
}

export function receiveSupplyMock(
  supplyId: string,
  dto: TSupplyReceiveDto,
): Promise<TSupplyDto> {
  return withDelay(() => {
    const supply = findSupply(supplyId)

    if (supply.status !== 'Created') {
      throw mockApiError(
        409,
        `Поставка №${supply.number} уже ${supply.status === 'Received' ? 'принята' : 'отменена'}.`,
      )
    }

    const received = new Map(
      dto.items.map((item) => [item.productId, item.receivedQuantity]),
    )

    const excess = supply.items.find(
      (item) => (received.get(item.productId) ?? 0) > item.quantity,
    )
    if (excess) {
      throw mockApiError(
        400,
        `Нельзя принять больше заказанного: «${excess.productName ?? excess.sku}» заказано ${excess.quantity} шт.`,
      )
    }

    const updated: TSupplyDto = {
      ...supply,
      status: 'Received',
      receivedAt: new Date().toISOString(),
      items: supply.items.map((item) => ({
        ...item,
        receivedQuantity: received.get(item.productId) ?? 0,
      })),
    }
    supplies = supplies.map((item) => (item.id === supplyId ? updated : item))

    return updated
  })
}

export function cancelSupplyMock(supplyId: string): Promise<TSupplyDto> {
  return withDelay(() => {
    const supply = findSupply(supplyId)

    if (supply.status !== 'Created') {
      throw mockApiError(
        409,
        `Поставка №${supply.number} уже ${supply.status === 'Received' ? 'принята' : 'отменена'}, отменить её нельзя.`,
      )
    }

    const updated: TSupplyDto = { ...supply, status: 'Cancelled' }
    supplies = supplies.map((item) => (item.id === supplyId ? updated : item))

    return updated
  })
}
