import { Tag } from 'antd'

import { ORDER_STATUS_VIEW } from '../lib/orderStatus'
import type { TOrderStatus } from '../model/order.types'

type TOrderStatusTagProps = {
  status: TOrderStatus
}

export function OrderStatusTag({ status }: TOrderStatusTagProps) {
  const { label, color } = ORDER_STATUS_VIEW[status]

  return <Tag color={color}>{label}</Tag>
}
