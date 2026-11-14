import type { TPaginatedResponse } from '@/shared/api'

import type {
  TCustomer,
  TCustomerDetail,
  TCustomersQuery,
} from '../model/customer.types'

import type {
  TCustomerDetailDto,
  TCustomerDto,
  TCustomersPageDto,
  TCustomersQueryDto,
} from './customer.dto'

export function mapCustomerDto(dto: TCustomerDto): TCustomer {
  return {
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    email: dto.email ?? '',
    address: dto.address ?? '',
    createdAt: dto.createdAt,
  }
}

export function mapCustomersPageDto(
  dto: TCustomersPageDto,
): TPaginatedResponse<TCustomer> {
  return {
    items: dto.data.map(mapCustomerDto),
    page: dto.meta.page,
    pageSize: dto.meta.limit,
    totalCount: dto.meta.total,
  }
}

export function mapCustomersQuery(query: TCustomersQuery): TCustomersQueryDto {
  return {
    search: query.search?.trim() || undefined,
    page: query.page,
    limit: query.pageSize,
  }
}

export function mapCustomerDetailDto(dto: TCustomerDetailDto): TCustomerDetail {
  return {
    ...mapCustomerDto(dto),
    ordersCount: dto.ordersCount,
    totalSpent: dto.totalSpent,
    orders: dto.orders.map((order) => ({
      id: order.id,
      number: order.number,
      createdAt: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
    })),
  }
}
