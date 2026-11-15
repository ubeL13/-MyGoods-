import { useEffect, useState } from 'react'

import {
  getWriteOffs,
  type TWriteOff,
  type TWriteOffsFilters,
} from '@/entities/write-off'
import type { TPaginatedResponse, TPaginationParams } from '@/shared/api'
import { getApiErrorMessage } from '@/shared/lib'

export const DEFAULT_PAGE_SIZE = 20

type TLoadResult = {
  key: string
  data?: TPaginatedResponse<TWriteOff>
  error?: string
}

export function useWriteOffsPage() {
  const [pagination, setPagination] = useState<TPaginationParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [filters, setFilters] = useState<TWriteOffsFilters>({})
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState<TLoadResult | null>(null)
  const [lastData, setLastData] = useState<
    TPaginatedResponse<TWriteOff> | undefined
  >()

  const { page, pageSize } = pagination
  const requestKey = JSON.stringify({ page, pageSize, reloadKey, ...filters })

  useEffect(() => {
    let isCancelled = false

    getWriteOffs({ page, pageSize, ...filters })
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
    writeOffs: lastData?.items ?? [],
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
    changeFilters: (nextFilters: TWriteOffsFilters) => {
      setFilters(nextFilters)
      setPagination((prev) => ({ ...prev, page: 1 }))
    },
  }
}
