import type { TPaginatedResponse } from '@/shared/api'

import type {
  TSuppliesQuery,
  TSupply,
  TSupplyListItem,
  TSupplyStatus,
} from '../model/supply.types'

import type {
  TSuppliesPageDto,
  TSuppliesQueryDto,
  TSupplyDto,
  TSupplyListItemDto,
} from './supply.dto'

export function mapSupplyDto(dto: TSupplyDto): TSupply {
  return {
    id: dto.id,
    number: dto.number,
    supplierId: dto.supplierId,
    supplierName: dto.supplierName ?? '',
    status: dto.status as TSupplyStatus,
    expectedDate: dto.expectedDate,
    comment: dto.comment ?? '',
    totalAmount: dto.totalAmount,
    createdAt: dto.createdAt,
    receivedAt: dto.receivedAt,
    items: dto.items.map((item) => ({
      productId: item.productId,
      sku: item.sku ?? '',
      productName: item.productName ?? '',
      quantity: item.quantity,
      receivedQuantity: item.receivedQuantity,
      purchasePrice: item.purchasePrice,
      sum: item.sum,
    })),
  }
}

export function mapSupplyListItemDto(dto: TSupplyListItemDto): TSupplyListItem {
  return {
    id: dto.id,
    number: dto.number,
    supplierName: dto.supplierName ?? '',
    status: dto.status as TSupplyStatus,
    expectedDate: dto.expectedDate,
    itemsCount: dto.itemsCount,
    totalAmount: dto.totalAmount,
    createdAt: dto.createdAt,
  }
}

export function mapSuppliesPageDto(
  dto: TSuppliesPageDto,
): TPaginatedResponse<TSupplyListItem> {
  return {
    items: dto.data.map(mapSupplyListItemDto),
    page: dto.meta.page,
    pageSize: dto.meta.limit,
    totalCount: dto.meta.total,
  }
}

export function mapSuppliesQuery(query: TSuppliesQuery): TSuppliesQueryDto {
  return {
    status: query.status,
    search: query.search?.trim() || undefined,
    page: query.page,
    limit: query.pageSize,
  }
}
