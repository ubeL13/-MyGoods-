export {
  getCustomerById,
  getCustomers,
  searchCustomers,
} from './api/customer.service'
export type {
  TCustomer,
  TCustomerDetail,
  TCustomerOrder,
  TCustomersQuery,
} from './model/customer.types'
export { useCustomerDetail } from './model/useCustomerDetail'
export { useCustomerOptions } from './model/useCustomerOptions'
