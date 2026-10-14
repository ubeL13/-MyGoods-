import type { TStockStatus } from '../model/product.types'

export function resolveStockStatus(
  quantity: number,
  min: number,
): TStockStatus {
  if (quantity <= 0) return 'OutOfStock'
  if (quantity <= min) return 'LowStock'
  return 'InStock'
}
