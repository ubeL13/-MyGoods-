import type { TCustomer } from '../model/customer.types'

import type { TCustomerDto } from './customer.dto'

export function mapCustomerDto(dto: TCustomerDto): TCustomer {
  return {
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    email: dto.email ?? '',
    address: dto.address ?? '',
  }
}
