export const API_V1_PREFIX = '/api/v1' as const

const v1 = (path: string) => `${API_V1_PREFIX}${path}`

export const API_ENDPOINTS = {
  products: {
    list: v1('/products'),
    byId: (productId: number | string) => v1(`/products/${productId}`),
    active: (productId: number | string) => v1(`/products/${productId}/active`),
  },
  categories: {
    list: v1('/categories'),
    byId: (categoryId: number | string) => v1(`/categories/${categoryId}`),
  },
  orders: {
    list: v1('/orders'),
    byId: (orderId: string) => v1(`/orders/${orderId}`),
  },
  customers: {
    list: v1('/customers'),
  },
} as const
