import type { TPaginatedResponse } from '@/shared/api'

import type {
  TProductListItem,
  TProductsFilters,
  TProductsQuery,
  TStockStatus,
} from '../model/product.types'
const MOCK_DELAY_MS = 400

const CATEGORY_ID_BY_NAME: Record<string, string> = {
  Кухня: '10000000-0000-0000-0000-000000000001',
  Ванная: '10000000-0000-0000-0000-000000000002',
  Спальня: '10000000-0000-0000-0000-000000000003',
  Декор: '10000000-0000-0000-0000-000000000004',
  Хранение: '10000000-0000-0000-0000-000000000005',
  Текстиль: '10000000-0000-0000-0000-000000000006',
}

const SOURCE: [name: string, category: string, price: number][] = [
  ['Чайник электрический', 'Кухня', 2490],
  ['Сковорода антипригарная 28 см', 'Кухня', 1890],
  ['Набор ножей 5 шт.', 'Кухня', 3250],
  ['Разделочная доска бамбук', 'Кухня', 590],
  ['Кастрюля 3 л', 'Кухня', 1690],
  ['Френч-пресс 600 мл', 'Кухня', 890],
  ['Полотенце банное 70×140', 'Ванная', 990],
  ['Коврик для ванной', 'Ванная', 750],
  ['Дозатор для мыла', 'Ванная', 420],
  ['Шторка для душа', 'Ванная', 1150],
  ['Комплект постельного белья евро', 'Спальня', 4590],
  ['Подушка 50×70', 'Спальня', 1290],
  ['Одеяло всесезонное', 'Спальня', 3490],
  ['Плед флисовый', 'Спальня', 1390],
  ['Ваза керамическая', 'Декор', 1790],
  ['Свеча ароматическая', 'Декор', 490],
  ['Рамка для фото 15×21', 'Декор', 350],
  ['Настенные часы', 'Декор', 2190],
  ['Искусственное растение в горшке', 'Декор', 1590],
  ['Корзина плетёная', 'Хранение', 1090],
  ['Контейнер для продуктов 1 л', 'Хранение', 290],
  ['Органайзер для обуви', 'Хранение', 1490],
  ['Вешалка напольная', 'Хранение', 2790],
  ['Короб для хранения с крышкой', 'Хранение', 690],
  ['Скатерть хлопковая', 'Текстиль', 1350],
  ['Набор кухонных полотенец 3 шт.', 'Текстиль', 650],
  ['Декоративная подушка', 'Текстиль', 890],
  ['Шторы блэкаут 2 шт.', 'Текстиль', 3990],
  ['Салфетки сервировочные 4 шт.', 'Текстиль', 790],
  ['Кружка 350 мл', 'Кухня', 390],
  ['Набор бокалов 6 шт.', 'Кухня', 1990],
  ['Сушилка для посуды', 'Кухня', 1290],
  ['Мыльница', 'Ванная', 260],
  ['Полка для ванной угловая', 'Ванная', 1390],
  ['Светильник ночной', 'Спальня', 1890],
  ['Зеркало настенное', 'Декор', 2990],
  ['Ящик для игрушек', 'Хранение', 1590],
]

function resolveStockStatus(quantity: number, min: number): TStockStatus {
  if (quantity === 0) return 'OutOfStock'
  if (quantity <= min) return 'LowStock'
  return 'InStock'
}

const MOCK_PRODUCTS: TProductListItem[] = SOURCE.map(
  ([name, categoryName, price], index) => {
    const quantity = index % 7 === 0 ? 0 : (index * 13) % 45
    const min = 8 + (index % 3) * 6

    return {
      id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
      sku: `MG-${String(index + 1).padStart(4, '0')}`,
      name,
      price,
      categoryId: CATEGORY_ID_BY_NAME[categoryName] ?? '',
      categoryName,
      quantity,
      min,
      stockStatus: resolveStockStatus(quantity, min),
      isActive: index % 11 !== 5,
    }
  },
)

function matchesFilters(
  product: TProductListItem,
  { search, categoryId, priceFrom, priceTo, inStock }: TProductsFilters,
): boolean {
  if (search) {
    const query = search.toLowerCase()
    const isFound =
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)

    if (!isFound) return false
  }

  if (categoryId && product.categoryId !== categoryId) return false
  if (priceFrom !== undefined && product.price < priceFrom) return false
  if (priceTo !== undefined && product.price > priceTo) return false
  if (inStock && product.quantity === 0) return false

  return true
}

export function getProductsMock({
  page,
  pageSize,
  ...filters
}: TProductsQuery): Promise<TPaginatedResponse<TProductListItem>> {
  const filtered = MOCK_PRODUCTS.filter((product) =>
    matchesFilters(product, filters),
  )
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          items,
          page,
          pageSize,
          totalCount: filtered.length,
        }),
      MOCK_DELAY_MS,
    )
  })
}
