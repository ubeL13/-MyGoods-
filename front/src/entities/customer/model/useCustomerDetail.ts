import { useEffect, useState } from 'react'

import { getApiErrorMessage, isNotFoundError } from '@/shared/lib'

import { getCustomerById } from '../api/customer.service'

import type { TCustomerDetail } from './customer.types'

type TLoadResult = {
  customerId: string
  customer?: TCustomerDetail
  error?: string
  isNotFound?: boolean
}

export function useCustomerDetail(customerId: string) {
  const [result, setResult] = useState<TLoadResult | null>(null)

  useEffect(() => {
    let isCancelled = false

    getCustomerById(customerId)
      .then((customer) => {
        if (isCancelled) return
        setResult({ customerId, customer })
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({
          customerId,
          error: getApiErrorMessage(error),
          isNotFound: isNotFoundError(error),
        })
      })

    return () => {
      isCancelled = true
    }
  }, [customerId])

  const isCurrent = result?.customerId === customerId

  return {
    customer: isCurrent ? result?.customer : undefined,
    isLoading: !isCurrent,
    error: isCurrent ? result?.error : undefined,
    isNotFound: isCurrent ? (result?.isNotFound ?? false) : false,
  }
}
