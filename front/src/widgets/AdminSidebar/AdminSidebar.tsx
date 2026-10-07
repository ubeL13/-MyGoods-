import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ADMIN_MENU_GROUPS } from './model/menuConfig'

import styles from './adminSidebar.module.css'

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const { items, selectedKey, activeGroupKey } = useMemo(() => {
    const menuItems: MenuProps['items'] = []
    let activeKey = ''
    let activeGroup = ''

    for (const group of ADMIN_MENU_GROUPS) {
      const groupKey = `group-${group.key}`

      const children = group.items.map((item) => {
        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`)

        if (isActive) {
          activeKey = item.key
          activeGroup = groupKey
        }

        return {
          key: item.key,
          label: item.label,
        }
      })

      menuItems.push({
        key: groupKey,
        label: group.label,
        children,
      })
    }

    return {
      items: menuItems,
      selectedKey: activeKey,
      activeGroupKey: activeGroup,
    }
  }, [location.pathname])

  const [openKeys, setOpenKeys] = useState<string[]>(
    activeGroupKey ? [activeGroupKey] : [],
  )
  const [syncedGroupKey, setSyncedGroupKey] = useState(activeGroupKey)

  if (activeGroupKey !== syncedGroupKey) {
    setSyncedGroupKey(activeGroupKey)
    setOpenKeys(activeGroupKey ? [activeGroupKey] : [])
  }

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key))
    setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
  }

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    for (const group of ADMIN_MENU_GROUPS) {
      const item = group.items.find((entry) => entry.key === key)
      if (item) {
        navigate(item.path)
        return
      }
    }
  }

  return (
    <aside className={styles['admin-sidebar']}>
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={items}
        onClick={handleClick}
        className={styles['admin-sidebar__menu']}
      />
    </aside>
  )
}
