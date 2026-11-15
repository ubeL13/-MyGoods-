import type { Dayjs } from 'dayjs'

export type TSupplyFormItem = {
  productId?: string
  quantity: number
  purchasePrice?: number
}

export type TSupplyFormValues = {
  supplierId?: string
  expectedDate?: Dayjs
  comment?: string
  items: TSupplyFormItem[]
}
