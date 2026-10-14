import { App, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { createProduct, type TProductFormValues } from '@/entities/product'
import { ProductForm } from '@/features/product-form'
import { APP_ROUTES } from '@/shared/config/routes'

export function ProductCreatePage() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const handleSubmit = async (values: TProductFormValues) => {
    const product = await createProduct(values)
    message.success('Товар создан')
    navigate(APP_ROUTES.productDetail(product.id))
  }

  return (
    <section>
      <Typography.Title level={2}>Новый товар</Typography.Title>
      <ProductForm
        submitText="Создать"
        onSubmit={handleSubmit}
        onCancel={() => navigate(APP_ROUTES.products)}
      />
    </section>
  )
}
