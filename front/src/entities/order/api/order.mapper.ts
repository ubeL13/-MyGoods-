import type { TPaginatedResponse } from '@/shared/api'

import type {
  TOrder,
  TOrderListItem,
  TOrdersQuery,
  TOrderStatus,
} from '../model/order.types'

import type {
  TOrderDto,
  TOrderListItemDto,
  TOrdersPageDto,
  TOrdersQueryDto,
} from './order.dto'

export function mapOrderDto(dto: TOrderDto): TOrder {
  return {
    id: dto.id,
    number: dto.number,
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

export function mapOrderListItemDto(dto: TOrderListItemDto): TOrderListItem {
  return {
    id: dto.id,
    number: dto.number,
    customerName: dto.customerName ?? '',
    customerPhone: dto.customerPhone ?? '',
    status: dto.status as TOrderStatus,
    totalAmount: dto.totalAmount,
    itemsCount: dto.itemsCount,
    createdAt: dto.createdAt,
  }
}

export function mapOrdersPageDto(
  dto: TOrdersPageDto,
): TPaginatedResponse<TOrderListItem> {
  return {
    items: dto.data.map(mapOrderListItemDto),
    page: dto.meta.page,
    pageSize: dto.meta.limit,
    totalCount: dto.meta.total,
  }
}

export function mapOrdersQuery(query: TOrdersQuery): TOrdersQueryDto {
  return {
    status: query.status,
    search: query.search?.trim() || undefined,
    page: query.page,
    limit: query.pageSize,
  }
}
