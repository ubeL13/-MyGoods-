export type TWriteOffDto = {
  id: string
  number: number
  productId: string
  sku: string | null
  productName: string | null
  quantity: number
  reason: string
  comment: string | null
  status: string
  createdBy: string
  createdAt: string
  reviewedAt: string | null
  rejectionReason: string | null
}

export type TWriteOffsPageDto = {
  data: TWriteOffDto[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TWriteOffsQueryDto = {
  status?: string
  reason?: string
  search?: string
  page: number
  limit: number
}

export type TWriteOffCreateDto = {
  productId: string
  quantity: number
  reason: string
  comment: string | null
  createdBy: string
}

export type TWriteOffRejectDto = {
  reason: string
}
