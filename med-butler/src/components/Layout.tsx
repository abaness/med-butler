import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import AIButlerFab from './AIButlerFab'
import { useStore } from '../store/useStore'
import { cx } from '../utils'

export default function Layout() {
  const elderMode = useStore((s) => s.elderMode)
  const loc = useLocation()
  // 老人模式下隐藏悬浮球，避免误触；AI 入口仍在"服务"页和首页文案中提供
  const showFab = !loc.pathname.startsWith('/chat') && !elderMode

  return (
    <div
      className={cx(
        'min-h-screen mx-auto max-w-[440px] bg-[#fff7ec] shadow-[0_0_40px_rgba(0,0,0,0.08)] relative',
        elderMode && 'elder-mode',
      )}
    >
      <div className="pb-24">
        <Outlet />
      </div>
      {showFab && <AIButlerFab />}
      <BottomNav />
    </div>
  )
}
