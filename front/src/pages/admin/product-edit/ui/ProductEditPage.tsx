import { Alert, App, Result, Skeleton, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import {
  type TProductFormValues,
  updateProduct,
  useProductDetail,
} from '@/entities/product'
import { ProductForm } from '@/features/product-form'
import { APP_ROUTES } from '@/shared/config/routes'

export function ProductEditPage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { product, isLoading, error, isNotFound } = useProductDetail(productId)

  if (isNotFound) {
    return <Result status="404" title="Товар не найден" />
  }

  const handleSubmit = async (values: TProductFormValues) => {
    await updateProduct(productId, values)
    message.success('Изменения сохранены')
    navigate(APP_ROUTES.productDetail(productId))
  }

  return (
    <section>
      <Typography.Title level={2}>Редактирование товара</Typography.Title>

      {isLoading && <Skeleton active paragraph={{ rows: 6 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {product && (
        <ProductForm
          key={product.id}
          initialValues={{
            categoryId: product.categoryId,
            sku: product.sku,
            name: product.name,
            price: product.price,
            description: product.description,
            manufacturer: product.manufacturer,
            min: product.min,
          }}
          submitText="Сохранить"
          onSubmit={handleSubmit}
          onCancel={() => navigate(APP_ROUTES.productDetail(productId))}
        />
      )}
    </section>
  )
}
