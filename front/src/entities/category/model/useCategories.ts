import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '@/shared/lib'

import { getCategories } from '../api/category.service'

import type { TCategory } from './category.types'

type TLoadResult = {
  categories?: TCategory[]
  error?: string
}

export function useCategories() {
  const [result, setResult] = useState<TLoadResult | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let isCancelled = false

    getCategories()
      .then((categories) => {
        if (isCancelled) return
        setResult({ categories })
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({ error: getApiErrorMessage(error) })
      })

    return () => {
      isCancelled = true
    }
  }, [version])

  return {
    categories: result?.categories ?? [],
    isLoading: result === null,
    error: result?.error,
    reload: () => {
      setResult(null)
      setVersion((prev) => prev + 1)
    },
  }
}
