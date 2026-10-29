import { useEffect, useState } from 'react'

import { getProducts, type TProductListItem } from '@/entities/product'

export function useProductOptions(search: string) {
  const [products, setProducts] = useState<TProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const timerId = setTimeout(async () => {
      setIsLoading(true)

      try {
        const data = await getProducts({
          search: search.trim() || undefined,
          page: 1,
          pageSize: 20,
        })
        if (!isCancelled) setProducts(data.items)
      } catch {
        if (!isCancelled) setProducts([])
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }, 300)

    return () => {
      isCancelled = true
      clearTimeout(timerId)
    }
  }, [search])

  return { products, isLoading }
}
