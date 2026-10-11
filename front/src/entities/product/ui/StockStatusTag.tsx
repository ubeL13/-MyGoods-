import { Tag } from 'antd'

import type { TStockStatus } from '../model/product.types'

const STOCK_STATUS_VIEW: Record<
  TStockStatus,
  { label: string; color: string }
> = {
  InStock: { label: 'В наличии', color: 'success' },
  LowStock: { label: 'Заканчивается', color: 'warning' },
  OutOfStock: { label: 'Нет в наличии', color: 'default' },
}

type TStockStatusTagProps = {
  status: TStockStatus
}

export function StockStatusTag({ status }: TStockStatusTagProps) {
  const { label, color } = STOCK_STATUS_VIEW[status]

  return <Tag color={color}>{label}</Tag>
}
