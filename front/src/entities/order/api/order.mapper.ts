import type { TOrder, TOrderStatus } from '../model/order.types'

import type { TOrderDto } from './order.dto'

export function mapOrderDto(dto: TOrderDto): TOrder {
  return {
    id: dto.id,
    customerId: dto.customerId,
    customerName: dto.customerName ?? '',
    customerPhone: dto.customerPhone ?? '',
    status: dto.status as TOrderStatus,
    deliveryAddress: dto.deliveryAddress,
    totalAmount: dto.totalAmount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
    items: dto.items.map((item) => ({
      productId: item.productId,
      sku: item.sku ?? '',
      productName: item.productName ?? '',
      quantity: item.quantity,
      price: item.price,
      sum: item.sum,
    })),
  }
}
