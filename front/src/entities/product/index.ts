export {
  createProduct,
  getProductById,
  getProducts,
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
export { StockStatusTag } from './ui/StockStatusTag'
