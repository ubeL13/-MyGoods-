import type { TPaginatedResponse } from '@/shared/api'

import type {
  TWriteOff,
  TWriteOffReason,
  TWriteOffsQuery,
  TWriteOffStatus,
} from '../model/writeOff.types'

import type {
  TWriteOffDto,
  TWriteOffsPageDto,
  TWriteOffsQueryDto,
} from './writeOff.dto'

export function mapWriteOffDto(dto: TWriteOffDto): TWriteOff {
  return {
    id: dto.id,
    number: dto.number,
    productId: dto.productId,
    sku: dto.sku ?? '',
    productName: dto.productName ?? '',
    quantity: dto.quantity,
    reason: dto.reason as TWriteOffReason,
    comment: dto.comment ?? '',
    status: dto.status as TWriteOffStatus,
    createdBy: dto.createdBy,
    createdAt: dto.createdAt,
    reviewedAt: dto.reviewedAt,
    rejectionReason: dto.rejectionReason ?? '',
  }
}

export function mapWriteOffsPageDto(
  dto: TWriteOffsPageDto,
): TPaginatedResponse<TWriteOff> {
  return {
    items: dto.data.map(mapWriteOffDto),
    page: dto.meta.page,
    pageSize: dto.meta.limit,
    totalCount: dto.meta.total,
  }
}

export function mapWriteOffsQuery(query: TWriteOffsQuery): TWriteOffsQueryDto {
  return {
    status: query.status,
    reason: query.reason,
    search: query.search?.trim() || undefined,
    page: query.page,
    limit: query.pageSize,
  }
}
