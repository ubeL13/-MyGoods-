export type TStockStatus = 'InStock' | 'LowStock' | 'OutOfStock'

export type TProductListItem = {
  id: string
  sku: string
  name: string
  price: number
  categoryName: string
  quantity: number
  min: number
  stockStatus: TStockStatus
  isActive: boolean
}
