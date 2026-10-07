import { NavLink } from 'react-router-dom'

import { APP_ROUTES } from '@/shared/config/routes'

import styles from './header.module.css'

export function Header() {
  return (
    <div className={styles['header__inner']}>
      <NavLink to={APP_ROUTES.home} className={styles['header__home']}>
        MyGoods
      </NavLink>
    </div>
  )
}
