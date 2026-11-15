export {
  createProduct,
  getProductById,
  getProducts,
  setProductActive,
  updateProduct,
} from './api/product.service'
export type {
  TProductDetail,
  TProductFormValues,
  TProductListItem,
  TProductsFilters,
  TProductsQuery,
  TStockStatus,
} from './model/product.types'
export { useProductDetail } from './model/useProductDetail'
export { useProductOptions } from './model/useProductOptions'
export { ProductSelect } from './ui/ProductSelect'
export { StockStatusTag } from './ui/StockStatusTag'
