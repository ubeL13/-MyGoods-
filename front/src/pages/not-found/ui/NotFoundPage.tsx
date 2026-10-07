import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '@/shared/config/routes'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Result
      subTitle="Такой страницы нет"
      extra={
        <Button type="primary" onClick={() => navigate(APP_ROUTES.home)}>
          На главную
        </Button>
      }
    />
  )
}
