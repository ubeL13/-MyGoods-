import { useEffect, useState } from 'react'

import { getSuppliers } from '../api/supplier.service'

import type { TSupplier } from './supplier.types'

export function useSupplierOptions(search: string) {
  const [suppliers, setSuppliers] = useState<TSupplier[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const timerId = setTimeout(async () => {
      setIsLoading(true)

      try {
        const data = await getSuppliers({
          search: search.trim() || undefined,
          archived: false,
          page: 1,
          pageSize: 20,
        })
        if (!isCancelled) setSuppliers(data.items)
      } catch {
        if (!isCancelled) setSuppliers([])
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }, 300)

    return () => {
      isCancelled = true
      clearTimeout(timerId)
    }
  }, [search])

  return { suppliers, isLoading }
}
