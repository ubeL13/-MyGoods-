import type { TPaginatedResponse, TPaginationParams } from '@/shared/api'

import type { TProductListItem, TStockStatus } from '../model/product.types'

const MOCK_DELAY_MS = 400

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
      categoryName,
      quantity,
      min,
      stockStatus: resolveStockStatus(quantity, min),
      isActive: index % 11 !== 5,
    }
  },
)

export function getProductsMock({
  page,
  pageSize,
}: TPaginationParams): Promise<TPaginatedResponse<TProductListItem>> {
  const start = (page - 1) * pageSize
  const items = MOCK_PRODUCTS.slice(start, start + pageSize)

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          items,
          page,
          pageSize,
          totalCount: MOCK_PRODUCTS.length,
        }),
      MOCK_DELAY_MS,
    )
  })
}
