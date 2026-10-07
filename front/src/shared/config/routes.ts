const ADMIN = '/admin' as const

/** Префикс сегмента для вложенных маршрутов под AdminLayout */
export const ADMIN_ROUTE_PREFIX = 'admin' as const

export const APP_ROUTES = {
  home: '/',
  products: `${ADMIN}/products`,
  productDetail: (productId: string | number) =>
    `${ADMIN}/products/${productId}`,
  categories: `${ADMIN}/categories`,
} as const

/**
 * Сегменты маршрутов относительно `ADMIN_ROUTE_PREFIX` (`/admin`).
 * В routes.tsx: path: `${ADMIN_ROUTE_PREFIX}` + children с этими сегментами.
 */
export const ROUTE_SEGMENTS = {
  products: 'products',
  productDetail: 'products/:productId',
  categories: 'categories',
} as const

export const ROUTE_ROOT = '/' as const
