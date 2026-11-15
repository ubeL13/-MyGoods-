import { App, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { createSupply, type TSupplyCreateValues } from '@/entities/supply'
import { SupplyForm } from '@/features/supply-form'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatPrice } from '@/shared/lib'

export function SupplyCreatePage() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const handleSubmit = async (values: TSupplyCreateValues) => {
    const supply = await createSupply(values)
    message.success(
      `Поставка №${supply.number} оформлена на ${formatPrice(supply.totalAmount)}`,
    )
    navigate(APP_ROUTES.supplyDetail(supply.id))
  }

  return (
    <section>
      <Typography.Title level={2}>Новая поставка</Typography.Title>
      <SupplyForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(APP_ROUTES.supplies)}
      />
    </section>
  )
}
