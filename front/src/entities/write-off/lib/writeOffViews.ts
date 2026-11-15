import type { TWriteOffReason, TWriteOffStatus } from '../model/writeOff.types'

export const WRITE_OFF_STATUSES: TWriteOffStatus[] = [
  'Pending',
  'Approved',
  'Rejected',
]

export const WRITE_OFF_STATUS_VIEW: Record<
  TWriteOffStatus,
  { label: string; pluralLabel: string; color: string }
> = {
  Pending: {
    label: 'На рассмотрении',
    pluralLabel: 'На рассмотрении',
    color: 'gold',
  },
  Approved: { label: 'Одобрена', pluralLabel: 'Одобренные', color: 'success' },
  Rejected: { label: 'Отклонена', pluralLabel: 'Отклонённые', color: 'error' },
}

export const WRITE_OFF_REASONS: TWriteOffReason[] = [
  'Damaged',
  'Lost',
  'Expired',
  'Other',
]

export const WRITE_OFF_REASON_LABEL: Record<TWriteOffReason, string> = {
  Damaged: 'Порча',
  Lost: 'Утрата',
  Expired: 'Истёк срок',
  Other: 'Другое',
}
