import { NavLink } from 'react-router-dom'
import { Home, Package, Calendar, ShoppingBag, User } from 'lucide-react'
import { cx } from '../utils'
import { useStore } from '../store/useStore'

const tabs = [
  { to: '/', label: '首页', icon: Home, exact: true },
  { to: '/medicine', label: '药箱', icon: Package },
  { to: '/schedule', label: '日程', icon: Calendar },
  { to: '/services', label: '服务', icon: ShoppingBag },
  { to: '/me', label: '我的', icon: User },
]

export default function BottomNav() {
  const elderMode = useStore((s) => s.elderMode)
  const iconSize = elderMode ? 28 : 22

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/95 backdrop-blur border-t border-gray-100 z-40">
      <ul className={cx('grid grid-cols-5', elderMode ? 'py-2' : 'py-1')}>
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) =>
                cx(
                  'flex flex-col items-center justify-center gap-0.5 transition-colors',
                  elderMode ? 'py-2 text-sm gap-1' : 'py-1.5 text-xs',
                  isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={iconSize} strokeWidth={isActive ? 2.6 : 2} />
                  <span className={cx(isActive ? 'font-semibold' : 'font-medium')}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
