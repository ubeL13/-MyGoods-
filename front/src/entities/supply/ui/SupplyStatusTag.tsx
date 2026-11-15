import { Tag } from 'antd'

import { SUPPLY_STATUS_VIEW } from '../lib/supplyStatus'
import type { TSupplyStatus } from '../model/supply.types'

type TSupplyStatusTagProps = {
  status: TSupplyStatus
}

export function SupplyStatusTag({ status }: TSupplyStatusTagProps) {
  const { label, color } = SUPPLY_STATUS_VIEW[status]

  return <Tag color={color}>{label}</Tag>
}
