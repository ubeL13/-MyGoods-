import { useEffect, useState } from 'react'

import { getApiErrorMessage, isNotFoundError } from '@/shared/lib'

import { getProductById } from '../api/product.service'

import type { TProductDetail } from './product.types'

type TLoadResult = {
  productId: string
  product?: TProductDetail
  error?: string
  isNotFound?: boolean
}

export function useProductDetail(productId: string) {
  const [result, setResult] = useState<TLoadResult | null>(null)

  useEffect(() => {
    let isCancelled = false

    getProductById(productId)
      .then((product) => {
        if (isCancelled) return
        setResult({ productId, product })
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({
          productId,
          error: getApiErrorMessage(error),
          isNotFound: isNotFoundError(error),
        })
      })

    return () => {
      isCancelled = true
    }
  }, [productId])

  const isCurrent = result?.productId === productId

  return {
    product: isCurrent ? result?.product : undefined,
    isLoading: !isCurrent,
    error: isCurrent ? result?.error : undefined,
    isNotFound: isCurrent ? (result?.isNotFound ?? false) : false,
    replaceProduct: (product: TProductDetail) =>
      setResult({ productId, product }),
  }
}
