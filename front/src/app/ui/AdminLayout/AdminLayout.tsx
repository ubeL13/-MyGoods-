import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import { AdminSidebar } from '@/widgets/AdminSidebar'

import styles from './adminLayout.module.css'

const { Sider, Content } = Layout

export function AdminLayout() {
  return (
    <Layout className={styles['admin-layout']}>
      <Sider
        width={260}
        theme="light"
        className={styles['admin-layout__sider']}
      >
        <AdminSidebar />
      </Sider>
      <Layout>
        <Content className={styles['admin-layout__content']}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
