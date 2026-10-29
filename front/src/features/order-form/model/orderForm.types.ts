export type TCustomerMode = 'existing' | 'new'

export type TOrderFormItem = {
  productId?: string
  quantity: number
}

export type TOrderFormValues = {
  customerMode: TCustomerMode
  customerId?: string
  newCustomer?: {
    name: string
    phone: string
    email?: string
  }
  deliveryAddress: string
  items: TOrderFormItem[]
}
