import { useEffect, useState } from 'react'

import { getApiErrorMessage, isNotFoundError } from '@/shared/lib'

import { getWriteOffById } from '../api/writeOff.service'

import type { TWriteOff } from './writeOff.types'

type TLoadResult = {
  writeOffId: string
  writeOff?: TWriteOff
  error?: string
  isNotFound?: boolean
}

export function useWriteOffDetail(writeOffId: string) {
  const [result, setResult] = useState<TLoadResult | null>(null)

  useEffect(() => {
    let isCancelled = false

    getWriteOffById(writeOffId)
      .then((writeOff) => {
        if (isCancelled) return
        setResult({ writeOffId, writeOff })
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({
          writeOffId,
          error: getApiErrorMessage(error),
          isNotFound: isNotFoundError(error),
        })
      })

    return () => {
      isCancelled = true
    }
  }, [writeOffId])

  const isCurrent = result?.writeOffId === writeOffId

  return {
    writeOff: isCurrent ? result?.writeOff : undefined,
    isLoading: !isCurrent,
    error: isCurrent ? result?.error : undefined,
    isNotFound: isCurrent ? (result?.isNotFound ?? false) : false,
    replaceWriteOff: (writeOff: TWriteOff) =>
      setResult({ writeOffId, writeOff }),
  }
}
