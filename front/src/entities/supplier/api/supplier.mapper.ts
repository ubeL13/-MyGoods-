import type { TPaginatedResponse } from '@/shared/api'

import type {
  TSupplier,
  TSupplierFormValues,
  TSuppliersQuery,
} from '../model/supplier.types'

import type {
  TSupplierDto,
  TSupplierEditDto,
  TSuppliersPageDto,
  TSuppliersQueryDto,
} from './supplier.dto'

export function mapSupplierDto(dto: TSupplierDto): TSupplier {
  return {
    id: dto.id,
    name: dto.name,
    inn: dto.inn ?? '',
    contactPerson: dto.contactPerson ?? '',
    phone: dto.phone ?? '',
    email: dto.email ?? '',
    address: dto.address ?? '',
    comment: dto.comment ?? '',
    isArchived: dto.isArchived,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
  }
}

export function mapSuppliersPageDto(
  dto: TSuppliersPageDto,
): TPaginatedResponse<TSupplier> {
  return {
    items: dto.data.map(mapSupplierDto),
    page: dto.meta.page,
    pageSize: dto.meta.limit,
    totalCount: dto.meta.total,
  }
}

export function mapSuppliersQuery(query: TSuppliersQuery): TSuppliersQueryDto {
  return {
    search: query.search?.trim() || undefined,
    archived: query.archived ?? false,
    page: query.page,
    limit: query.pageSize,
  }
}

const emptyToNull = (value: string) => value.trim() || null

export function toSupplierEditDto(
  values: TSupplierFormValues,
): TSupplierEditDto {
  return {
    name: values.name.trim(),
    inn: emptyToNull(values.inn),
    contactPerson: emptyToNull(values.contactPerson),
    phone: emptyToNull(values.phone),
    email: emptyToNull(values.email),
    address: emptyToNull(values.address),
    comment: emptyToNull(values.comment),
  }
}
