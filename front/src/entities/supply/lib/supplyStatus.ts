import type { TSupplyStatus } from '../model/supply.types'

export const SUPPLY_STATUSES: TSupplyStatus[] = [
  'Created',
  'Received',
  'Cancelled',
]

export const SUPPLY_STATUS_VIEW: Record<
  TSupplyStatus,
  { label: string; pluralLabel: string; color: string }
> = {
  Created: { label: 'Оформлена', pluralLabel: 'Оформленные', color: 'blue' },
  Received: { label: 'Принята', pluralLabel: 'Принятые', color: 'success' },
  Cancelled: { label: 'Отменена', pluralLabel: 'Отменённые', color: 'default' },
}
