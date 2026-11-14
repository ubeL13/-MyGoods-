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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: false,
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

function assertUnique(dto: TSupplierEditDto, exceptId?: string) {
  const others = suppliers.filter((item) => item.id !== exceptId)
  const name = dto.name.toLowerCase()

  if (others.some((item) => item.name.toLowerCase() === name)) {
    throw mockApiError(409, `Поставщик с названием «${dto.name}» уже есть.`)
  }

  const innOwner = dto.inn && others.find((item) => item.inn === dto.inn)
  if (innOwner) {
    throw mockApiError(
      409,
      `Поставщик с ИНН ${dto.inn} уже есть: «${innOwner.name}».`,
    )
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
    .filter((item) => item.isActive === query.isActive)
    .filter((item) => {
      if (!search) return true

      return (
        item.name.toLowerCase().includes(search) ||
        (item.contactPerson?.toLowerCase().includes(search) ?? false) ||
        (digits.length > 0 &&
          ((item.inn?.includes(digits) ?? false) ||
            item.phone.includes(digits)))
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
    assertUnique(dto)

    const supplier: TSupplierDto = {
      ...dto,
      phone: dto.phone.replace(/\D/g, ''),
      id: crypto.randomUUID(),
      isActive: true,
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
    assertUnique(dto, supplierId)

    return replaceSupplier({
      ...supplier,
      ...dto,
      phone: dto.phone.replace(/\D/g, ''),
      updatedAt: new Date().toISOString(),
    })
  })
}

export function setSupplierActiveMock(
  supplierId: string,
  isActive: boolean,
): Promise<TSupplierDto> {
  return withDelay(() =>
    replaceSupplier({
      ...findSupplier(supplierId),
      isActive,
      updatedAt: new Date().toISOString(),
    }),
  )
}
