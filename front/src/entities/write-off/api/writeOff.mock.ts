import { AxiosError, AxiosHeaders } from 'axios'

import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type {
  TWriteOffCreateDto,
  TWriteOffDto,
  TWriteOffRejectDto,
  TWriteOffsPageDto,
  TWriteOffsQueryDto,
} from './writeOff.dto'

const HOUR = 60 * 60 * 1000
const NOW = Date.UTC(2026, 10, 15, 12, 0)

const SEED: Omit<TWriteOffDto, 'id' | 'number' | 'createdAt' | 'productId'>[] =
  [
    {
      sku: 'TSH-001',
      productName: 'Футболка хлопковая белая',
      quantity: 2,
      reason: 'Damaged',
      comment: 'Пятна после транспортировки',
      status: 'Pending',
      createdBy: 'Кладовщик Иван',
      reviewedAt: null,
      rejectionReason: null,
    },
    {
      sku: 'PHN-001',
      productName: 'Смартфон Samsung Galaxy A55',
      quantity: 1,
      reason: 'Lost',
      comment: null,
      status: 'Pending',
      createdBy: 'Кладовщик Иван',
      reviewedAt: null,
      rejectionReason: null,
    },
    {
      sku: 'JKT-004',
      productName: 'Парка утеплённая',
      quantity: 1,
      reason: 'Damaged',
      comment: 'Порван рукав',
      status: 'Approved',
      createdBy: 'Мария Склад',
      reviewedAt: new Date(NOW - 20 * HOUR).toISOString(),
      rejectionReason: null,
    },
    {
      sku: 'TSH-005',
      productName: 'Лонгслив серый',
      quantity: 5,
      reason: 'Other',
      comment: 'Брак партии, нашивка не того цвета',
      status: 'Rejected',
      createdBy: 'Мария Склад',
      reviewedAt: new Date(NOW - 40 * HOUR).toISOString(),
      rejectionReason: 'Вернуть поставщику по гарантии, а не списывать',
    },
  ]

let writeOffs: TWriteOffDto[] = SEED.map((seed, index) => ({
  ...seed,
  id: `66666666-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
  number: SEED.length - index,
  productId: `77777777-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
  createdAt: new Date(NOW - (index * 18 + 2) * HOUR).toISOString(),
}))

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

export function getWriteOffsMock(
  query: TWriteOffsQueryDto,
): Promise<TWriteOffsPageDto> {
  const search = query.search?.toLowerCase() ?? ''
  const digits = search.replace(/\D/g, '')

  const found = writeOffs.filter((item) => {
    if (query.status && item.status !== query.status) return false
    if (query.reason && item.reason !== query.reason) return false
    if (!search) return true

    return (
      (item.productName?.toLowerCase().includes(search) ?? false) ||
      (item.sku?.toLowerCase().includes(search) ?? false) ||
      (digits.length > 0 && String(item.number) === digits)
    )
  })

  const start = (query.page - 1) * query.limit

  return withDelay(() => ({
    data: found.slice(start, start + query.limit),
    meta: {
      page: query.page,
      limit: query.limit,
      total: found.length,
      totalPages: Math.ceil(found.length / query.limit),
    },
  }))
}

export async function createWriteOffMock(
  dto: TWriteOffCreateDto,
): Promise<TWriteOffDto> {
  const { data: product } = await apiClient.get<{
    sku: string
    name: string
    stock: { available: number } | null
  }>(API_ENDPOINTS.products.byId(dto.productId))

  return withDelay(() => {
    if (dto.reason === 'Other' && !dto.comment) {
      throw mockApiError(400, 'Для причины «Другое» укажите комментарий.')
    }

    const available = product.stock?.available ?? 0
    if (dto.quantity > available) {
      throw mockApiError(
        409,
        `Нельзя списать ${dto.quantity} шт. «${product.name}»: доступно только ${available} шт.`,
      )
    }

    const writeOff: TWriteOffDto = {
      ...dto,
      id: crypto.randomUUID(),
      number: Math.max(0, ...writeOffs.map((item) => item.number)) + 1,
      sku: product.sku,
      productName: product.name,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      rejectionReason: null,
    }
    writeOffs = [writeOff, ...writeOffs]

    return writeOff
  })
}

function findWriteOff(writeOffId: string): TWriteOffDto {
  const writeOff = writeOffs.find((item) => item.id === writeOffId)
  if (!writeOff) throw mockApiError(404, 'Заявка на списание не найдена')
  return writeOff
}

function assertPending(writeOff: TWriteOffDto) {
  if (writeOff.status !== 'Pending') {
    throw mockApiError(
      409,
      `Заявка №${writeOff.number} уже ${writeOff.status === 'Approved' ? 'одобрена' : 'отклонена'}.`,
    )
  }
}

function replaceWriteOff(updated: TWriteOffDto): TWriteOffDto {
  writeOffs = writeOffs.map((item) => (item.id === updated.id ? updated : item))
  return updated
}

async function loadAvailable(productId: string): Promise<number | null> {
  try {
    const { data } = await apiClient.get<{
      stock: { available: number } | null
    }>(API_ENDPOINTS.products.byId(productId))
    return data.stock?.available ?? 0
  } catch {
    return null
  }
}

export function getWriteOffByIdMock(writeOffId: string): Promise<TWriteOffDto> {
  return withDelay(() => findWriteOff(writeOffId))
}

export async function approveWriteOffMock(
  writeOffId: string,
): Promise<TWriteOffDto> {
  const writeOff = writeOffs.find((item) => item.id === writeOffId)
  const available = writeOff ? await loadAvailable(writeOff.productId) : null

  return withDelay(() => {
    const current = findWriteOff(writeOffId)
    assertPending(current)

    if (available !== null && current.quantity > available) {
      throw mockApiError(
        409,
        `Нельзя одобрить: доступно только ${available} шт. «${current.productName}», остальное в резерве под заказы.`,
      )
    }

    return replaceWriteOff({
      ...current,
      status: 'Approved',
      reviewedAt: new Date().toISOString(),
    })
  })
}

export function rejectWriteOffMock(
  writeOffId: string,
  dto: TWriteOffRejectDto,
): Promise<TWriteOffDto> {
  return withDelay(() => {
    const current = findWriteOff(writeOffId)
    assertPending(current)

    if (!dto.reason.trim()) {
      throw mockApiError(400, 'Укажите причину отклонения.')
    }

    return replaceWriteOff({
      ...current,
      status: 'Rejected',
      reviewedAt: new Date().toISOString(),
      rejectionReason: dto.reason.trim(),
    })
  })
}
