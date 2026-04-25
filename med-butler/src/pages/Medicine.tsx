import { useNavigate } from 'react-router-dom'
import { Plus, Search, AlertTriangle, ShieldCheck, CalendarClock, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx } from '../utils'

export default function Medicine() {
  const nav = useNavigate()
  const { medicines, elderMode } = useStore()

  const lowStock = medicines.filter((m) => m.stockDays <= 3)
  const normal = medicines.filter((m) => m.stockDays > 3)

  return (
    <div className="pb-4">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">我的药箱</h1>
          <button
            onClick={() => nav('/medicine/add')}
            className="bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 rounded-full px-3 py-1.5 text-sm font-semibold flex items-center gap-1 active:scale-95"
          >
            <Plus size={16} /> 添加
          </button>
        </div>
        {/* 搜索框 · 老人模式隐藏（药品少，列表直观） */}
        {!elderMode && (
          <div className="mt-3 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
              placeholder="搜索药品名或适应症"
            />
          </div>
        )}
      </div>

      {/* 概况 · 老人模式下简化为 2 张卡（药品数 + 即将用完） */}
      <div className={cx('px-4 mt-4 grid gap-3', elderMode ? 'grid-cols-2' : 'grid-cols-3')}>
        <StatCard label="药品数" value={medicines.length} icon={<ShieldCheck size={18} />} color="text-brand-600 bg-brand-50" />
        <StatCard label="即将用完" value={lowStock.length} icon={<AlertTriangle size={18} />} color="text-meds-warn bg-orange-50" />
        {!elderMode && (
          <StatCard label="已生效处方" value={2} icon={<CalendarClock size={18} />} color="text-sky-600 bg-sky-50" />
        )}
      </div>

      {/* 相互作用检查入口 · 老人模式下隐藏（专业术语，移至药品详情页内嵌提示） */}
      {!elderMode && (
        <div className="px-4 mt-4">
          <button
            onClick={() => nav('/medicine/interaction')}
            className="w-full bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-3 flex items-center gap-3 active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">AI 药物相互作用检查</div>
              <div className="text-xs text-gray-500 mt-0.5">
                已识别 <b>1</b> 条注意事项，点击查看详情
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* 即将用完 */}
      {lowStock.length > 0 && (
        <div className="px-4 mt-4">
          <div className="text-sm font-semibold flex items-center gap-1 mb-2">
            <AlertTriangle size={16} className="text-meds-warn" />
            <span>即将用完</span>
          </div>
          <div className="space-y-2">
            {lowStock.map((m) => (
              <MedCard key={m.id} med={m} warn />
            ))}
          </div>
        </div>
      )}

      {/* 药品列表 */}
      <div className="px-4 mt-4">
        <div className="text-sm font-semibold mb-2">全部药品</div>
        <div className="space-y-2">
          {normal.map((m) => (
            <MedCard key={m.id} med={m} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-3">
      <div className={cx('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
        {icon}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function MedCard({ med, warn }: { med: ReturnType<typeof useStore.getState>['medicines'][number]; warn?: boolean }) {
  const nav = useNavigate()
  return (
    <button
      onClick={() => nav(`/medicine/${med.id}`)}
      className="w-full bg-white rounded-2xl shadow-card p-3 flex items-center gap-3 active:scale-[0.99]"
    >
      <div className={cx('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', med.iconColor)}>
        {med.emoji}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{med.name}</span>
          {med.brandName && (
            <span className="text-[10px] text-gray-400">[{med.brandName}]</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">{med.spec}</div>
        <div className="text-xs text-gray-500 mt-1 truncate">{med.indication}</div>
      </div>
      <div className="text-right">
        <div className={cx('text-sm font-semibold', warn ? 'text-meds-warn' : 'text-gray-700')}>
          {med.stockDays} 天
        </div>
        <div className="text-[10px] text-gray-400">剩余</div>
      </div>
    </button>
  )
}
