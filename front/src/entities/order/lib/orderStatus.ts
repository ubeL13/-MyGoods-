import type { TOrderStatus } from '../model/order.types'

export const ORDER_STATUSES: TOrderStatus[] = [
  'New',
  'Confirmed',
  'Assembled',
  'Shipped',
  'Delivered',
  'Cancelled',
]

export const ORDER_STATUS_VIEW: Record<
  TOrderStatus,
  { label: string; pluralLabel: string; color: string }
> = {
  New: { label: 'Новый', pluralLabel: 'Новые', color: 'blue' },
  Confirmed: {
    label: 'Подтверждён',
    pluralLabel: 'Подтверждённые',
    color: 'cyan',
  },
  Assembled: { label: 'Собран', pluralLabel: 'Собранные', color: 'purple' },
  Shipped: { label: 'Отправлен', pluralLabel: 'Отправленные', color: 'gold' },
  Delivered: {
    label: 'Доставлен',
    pluralLabel: 'Доставленные',
    color: 'success',
  },
  Cancelled: { label: 'Отменён', pluralLabel: 'Отменённые', color: 'default' },
}
