const ADMIN = '/admin' as const

export const ADMIN_ROUTE_PREFIX = 'admin' as const

export const APP_ROUTES = {
  home: '/',
  products: `${ADMIN}/products`,
  productDetail: (productId: string | number) =>
    `${ADMIN}/products/${productId}`,
  productCreate: `${ADMIN}/products/create`,
  productEdit: (productId: string | number) =>
    `${ADMIN}/products/${productId}/edit`,
  categories: `${ADMIN}/categories`,
  orders: `${ADMIN}/orders`,
  orderCreate: `${ADMIN}/orders/create`,
} as const

export const ROUTE_SEGMENTS = {
  products: 'products',
  productDetail: 'products/:productId',
  productCreate: 'products/create',
  productEdit: 'products/:productId/edit',
  categories: 'categories',
  orders: 'orders',
  orderCreate: 'orders/create',
} as const

export const ROUTE_ROOT = '/' as const
