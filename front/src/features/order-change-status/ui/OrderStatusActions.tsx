import { Flex } from 'antd'

import type { TOrder } from '@/entities/order'

import {
  CANCEL_ACTION,
  CANCELLABLE_STATUSES,
  NEXT_STATUS_ACTION,
} from '../model/statusActions'

import { StatusActionButton } from './StatusActionButton'

type TOrderStatusActionsProps = {
  order: TOrder
  onChange: (order: TOrder) => void
}

export function OrderStatusActions({
  order,
  onChange,
}: TOrderStatusActionsProps) {
  const nextAction = NEXT_STATUS_ACTION[order.status]
  const canCancel = CANCELLABLE_STATUSES.includes(order.status)

  if (!nextAction && !canCancel) return null

  return (
    <Flex gap="small" wrap>
      {nextAction && (
        <StatusActionButton
          order={order}
          action={nextAction}
          onChange={onChange}
        />
      )}
      {canCancel && (
        <StatusActionButton
          order={order}
          action={CANCEL_ACTION}
          danger
          onChange={onChange}
        />
      )}
    </Flex>
  )
}
