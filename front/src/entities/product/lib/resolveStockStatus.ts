import type { TStockStatus } from '../model/product.types'

export function resolveStockStatus(
  available: number,
  min: number,
): TStockStatus {
  if (available <= 0) return 'OutOfStock'
  if (available <= min) return 'LowStock'
  return 'InStock'
}
