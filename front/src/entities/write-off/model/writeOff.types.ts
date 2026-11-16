import type { TPaginationParams } from '@/shared/api'

export type TWriteOffReason = 'Damaged' | 'Lost' | 'Expired' | 'Other'

export type TWriteOffStatus = 'Pending' | 'Approved' | 'Rejected'

export type TWriteOff = {
  id: string
  number: number
  productId: string
  sku: string
  productName: string
  quantity: number
  reason: TWriteOffReason
  comment: string
  status: TWriteOffStatus
  createdBy: string
  createdAt: string
  reviewedAt: string | null
  rejectionReason: string
}

export type TWriteOffsFilters = {
  status?: TWriteOffStatus
  reason?: TWriteOffReason
  search?: string
}

export type TWriteOffsQuery = TPaginationParams & TWriteOffsFilters

export type TWriteOffCreateValues = {
  productId: string
  quantity: number
  reason: TWriteOffReason
  comment: string | null
  createdBy: string
}
