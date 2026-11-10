import { AxiosError, AxiosHeaders } from 'axios'

import type {
  TSupplierDto,
  TSupplierEditDto,
  TSuppliersPageDto,
  TSuppliersQueryDto,
} from './supplier.dto'

const CREATED_AT = '2026-10-01T09:00:00.000Z'

let suppliers: TSupplierDto[] = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    name: 'ООО «ТекстильПром»',
    inn: '6312012345',
    contactPerson: 'Сергей Воронин',
    phone: '78462001010',
    email: 'opt@textilprom.ru',
    address: 'Самара, ул. Партизанская, 17',
    comment: 'Футболки и шорты, отгрузка по вторникам',
    isArchived: false,
    createdAt: CREATED_AT,
    updatedAt: null,
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    name: 'ИП Малахова Е. А.',
    inn: '631900112233',
    contactPerson: 'Елена Малахова',
    phone: '79270004455',
    email: null,
    address: 'Тольятти, Южное ш., 3',
    comment: null,
    isArchived: false,
    createdAt: CREATED_AT,
    updatedAt: null,
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    name: 'ООО «ЭлектроСнаб»',
    inn: '7701234567',
    contactPerson: 'Артём Ким',
    phone: '74951234567',
    email: 'sales@elsnab.ru',
    address: 'Москва, Варшавское ш., 125',
    comment: 'Смартфоны и ноутбуки',
    isArchived: false,
    createdAt: CREATED_AT,
    updatedAt: null,
  },
  {
    id: '33333333-0000-0000-0000-000000000004',
    name: 'ООО «Верхняя одежда»',
    inn: '6316098765',
    contactPerson: null,
    phone: '78462337788',
    email: 'info@vodezhda.ru',
    address: null,
    comment: 'Больше не работаем',
    isArchived: true,
    createdAt: CREATED_AT,
    updatedAt: '2026-10-20T12:00:00.000Z',
  },
]

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

function findSupplier(supplierId: string): TSupplierDto {
  const supplier = suppliers.find((item) => item.id === supplierId)
  if (!supplier) throw mockApiError(404, 'Поставщик не найден')
  return supplier
}

function assertInnIsFree(inn: string | null, exceptId?: string) {
  if (!inn) return

  const owner = suppliers.find(
    (item) => item.inn === inn && item.id !== exceptId,
  )
  if (owner) {
    throw mockApiError(409, `Поставщик с ИНН ${inn} уже есть: «${owner.name}».`)
  }
}

function replaceSupplier(updated: TSupplierDto): TSupplierDto {
  suppliers = suppliers.map((item) => (item.id === updated.id ? updated : item))
  return updated
}

export function getSuppliersMock(
  query: TSuppliersQueryDto,
): Promise<TSuppliersPageDto> {
  const search = query.search?.toLowerCase() ?? ''
  const digits = search.replace(/\D/g, '')

  const found = suppliers
    .filter((item) => item.isArchived === query.archived)
    .filter((item) => {
      if (!search) return true

      return (
        item.name.toLowerCase().includes(search) ||
        (item.contactPerson?.toLowerCase().includes(search) ?? false) ||
        (digits.length > 0 &&
          ((item.inn?.includes(digits) ?? false) ||
            (item.phone?.includes(digits) ?? false)))
      )
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))

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

export function createSupplierMock(
  dto: TSupplierEditDto,
): Promise<TSupplierDto> {
  return withDelay(() => {
    assertInnIsFree(dto.inn)

    const supplier: TSupplierDto = {
      ...dto,
      id: crypto.randomUUID(),
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    }
    suppliers = [...suppliers, supplier]

    return supplier
  })
}

export function updateSupplierMock(
  supplierId: string,
  dto: TSupplierEditDto,
): Promise<TSupplierDto> {
  return withDelay(() => {
    const supplier = findSupplier(supplierId)
    assertInnIsFree(dto.inn, supplierId)

    return replaceSupplier({
      ...supplier,
      ...dto,
      updatedAt: new Date().toISOString(),
    })
  })
}

export function setSupplierArchivedMock(
  supplierId: string,
  isArchived: boolean,
): Promise<TSupplierDto> {
  return withDelay(() =>
    replaceSupplier({
      ...findSupplier(supplierId),
      isArchived,
      updatedAt: new Date().toISOString(),
    }),
  )
}
