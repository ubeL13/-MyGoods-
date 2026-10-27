import type { TPaginatedResponse } from '@/shared/api'

import { resolveStockStatus } from '../lib/resolveStockStatus'
import type {
  TProductDetail,
  TProductListItem,
  TProductsQuery,
  TStockStatus,
} from '../model/product.types'

import type {
  TPagedResultDto,
  TProductDto,
  TProductQueryDto,
  TStockStatusDto,
} from './product.dto'

const STOCK_STATUS_FROM_DTO: Record<TStockStatusDto, TStockStatus> = {
  Available: 'InStock',
  LessMinimum: 'LowStock',
  OutOfStock: 'OutOfStock',
}

export function mapProductDto(dto: TProductDto): TProductDetail {
  const quantity = dto.stock?.quantity ?? 0
  const reserved = dto.stock?.reserved ?? 0
  const available = dto.stock?.available ?? quantity - reserved
  const min = dto.stock?.min ?? 0
  const stockStatus =
    (dto.stock && STOCK_STATUS_FROM_DTO[dto.stock.status]) ??
    resolveStockStatus(available, min)

  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    price: dto.price,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName ?? '',
    description: dto.description,
    manufacturer: dto.manufacturer,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    quantity,
    reserved,
    available,
    min,
    stockStatus,
  }
}

export function mapProductsPageDto(
  dto: TPagedResultDto<TProductDto>,
): TPaginatedResponse<TProductListItem> {
  return {
    items: dto.data.map(mapProductDto),
    page: dto.meta.page,
    pageSize: dto.meta.limit,
    totalCount: dto.meta.total,
  }
}

export function mapProductsQuery(query: TProductsQuery): TProductQueryDto {
  return {
    search: query.search,
    categoryId: query.categoryId,
    minPrice: query.priceFrom,
    maxPrice: query.priceTo,
    inStock: query.inStock,
    page: query.page,
    limit: query.pageSize,
  }
}
