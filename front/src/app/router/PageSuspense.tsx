import { Spin } from 'antd'
import { type ReactNode, Suspense } from 'react'

type TPageSuspenseProps = {
  children: ReactNode
}

export function PageSuspense({ children }: TPageSuspenseProps) {
  return (
    <Suspense
      fallback={
        <div
          className="page__loader"
          role="status"
          aria-label="Загрузка страницы"
        >
          <Spin size="large" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
