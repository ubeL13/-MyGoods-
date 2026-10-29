import { useEffect, useState } from 'react'

import { getApiErrorMessage, isNotFoundError } from '@/shared/lib'

import { getOrderById } from '../api/order.service'

import type { TOrder } from './order.types'

type TLoadResult = {
  orderId: string
  order?: TOrder
  error?: string
  isNotFound?: boolean
}

export function useOrderDetail(orderId: string) {
  const [result, setResult] = useState<TLoadResult | null>(null)

  useEffect(() => {
    let isCancelled = false

    getOrderById(orderId)
      .then((order) => {
        if (isCancelled) return
        setResult({ orderId, order })
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({
          orderId,
          error: getApiErrorMessage(error),
          isNotFound: isNotFoundError(error),
        })
      })

    return () => {
      isCancelled = true
    }
  }, [orderId])

  const isCurrent = result?.orderId === orderId

  return {
    order: isCurrent ? result?.order : undefined,
    isLoading: !isCurrent,
    error: isCurrent ? result?.error : undefined,
    isNotFound: isCurrent ? (result?.isNotFound ?? false) : false,
    replaceOrder: (order: TOrder) => setResult({ orderId, order }),
  }
}
