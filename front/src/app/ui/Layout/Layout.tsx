import { Layout as AntdLayout } from 'antd'
import { Outlet } from 'react-router-dom'

import { Header } from '@/widgets/Header'

import styles from './layout.module.css'

const { Header: AntdHeader, Content } = AntdLayout

export function Layout() {
  return (
    <AntdLayout className={styles.layout}>
      <AntdHeader className={styles['layout__header']}>
        <Header />
      </AntdHeader>
      <Content className={styles['layout__main']}>
        <Outlet />
      </Content>
    </AntdLayout>
  )
}
