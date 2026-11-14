import { useEffect, useState } from 'react'

import { getApiErrorMessage, isNotFoundError } from '@/shared/lib'

import { getSupplyById } from '../api/supply.service'

import type { TSupply } from './supply.types'

type TLoadResult = {
  supplyId: string
  supply?: TSupply
  error?: string
  isNotFound?: boolean
}

export function useSupplyDetail(supplyId: string) {
  const [result, setResult] = useState<TLoadResult | null>(null)

  useEffect(() => {
    let isCancelled = false

    getSupplyById(supplyId)
      .then((supply) => {
        if (isCancelled) return
        setResult({ supplyId, supply })
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({
          supplyId,
          error: getApiErrorMessage(error),
          isNotFound: isNotFoundError(error),
        })
      })

    return () => {
      isCancelled = true
    }
  }, [supplyId])

  const isCurrent = result?.supplyId === supplyId

  return {
    supply: isCurrent ? result?.supply : undefined,
    isLoading: !isCurrent,
    error: isCurrent ? result?.error : undefined,
    isNotFound: isCurrent ? (result?.isNotFound ?? false) : false,
    replaceSupply: (supply: TSupply) => setResult({ supplyId, supply }),
  }
}
