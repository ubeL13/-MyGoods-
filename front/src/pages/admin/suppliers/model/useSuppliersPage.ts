import { useEffect, useState } from 'react'

import {
  getSuppliers,
  type TSupplier,
  type TSuppliersFilters,
} from '@/entities/supplier'
import type { TPaginatedResponse, TPaginationParams } from '@/shared/api'
import { getApiErrorMessage } from '@/shared/lib'

export const DEFAULT_PAGE_SIZE = 20

type TLoadResult = {
  key: string
  data?: TPaginatedResponse<TSupplier>
  error?: string
}

export function useSuppliersPage() {
  const [pagination, setPagination] = useState<TPaginationParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [filters, setFilters] = useState<TSuppliersFilters>({})
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState<TLoadResult | null>(null)
  const [lastData, setLastData] = useState<
    TPaginatedResponse<TSupplier> | undefined
  >()

  const { page, pageSize } = pagination
  const requestKey = JSON.stringify({ page, pageSize, reloadKey, ...filters })

  useEffect(() => {
    let isCancelled = false

    getSuppliers({ page, pageSize, ...filters })
      .then((data) => {
        if (isCancelled) return
        setResult({ key: requestKey, data })
        setLastData(data)
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({ key: requestKey, error: getApiErrorMessage(error) })
      })

    return () => {
      isCancelled = true
    }
  }, [page, pageSize, filters, requestKey])

  const isLoading = result?.key !== requestKey

  return {
    suppliers: lastData?.items ?? [],
    totalCount: lastData?.totalCount ?? 0,
    page,
    pageSize,
    filters,
    isLoading,
    error: isLoading ? undefined : result?.error,
    reload: () => setReloadKey((key) => key + 1),
    changePage: (nextPage: number, nextPageSize: number) =>
      setPagination({
        page: nextPageSize === pageSize ? nextPage : 1,
        pageSize: nextPageSize,
      }),
    changeFilters: (nextFilters: TSuppliersFilters) => {
      setFilters(nextFilters)
      setPagination((prev) => ({ ...prev, page: 1 }))
    },
  }
}
