import { useEffect, useState } from 'react'

import { getCategories } from '../api/category.service'

type TCategoryOption = {
  value: string
  label: string
}

export function useCategoryOptions() {
  const [options, setOptions] = useState<TCategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    getCategories()
      .then((categories) => {
        if (isCancelled) return
        setOptions(
          categories.map(({ id, name }) => ({ value: id, label: name })),
        )
      })
      .catch(() => {
        if (isCancelled) return
        setOptions([])
      })
      .finally(() => {
        if (isCancelled) return
        setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return { options, isLoading }
}
