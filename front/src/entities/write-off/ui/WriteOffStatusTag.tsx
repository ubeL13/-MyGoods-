import { Tag } from 'antd'

import { WRITE_OFF_STATUS_VIEW } from '../lib/writeOffViews'
import type { TWriteOffStatus } from '../model/writeOff.types'

type TWriteOffStatusTagProps = {
  status: TWriteOffStatus
}

export function WriteOffStatusTag({ status }: TWriteOffStatusTagProps) {
  const { label, color } = WRITE_OFF_STATUS_VIEW[status]

  return <Tag color={color}>{label}</Tag>
}
