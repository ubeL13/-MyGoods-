import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router'

export function AppProviders() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{ token: { colorBgLayout: '#ffffff' } }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
