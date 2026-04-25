import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import PageHeader from '../components/PageHeader'
import {
  Clock,
  AlertTriangle,
  CalendarDays,
  ShoppingBag,
  Info,
  Pill,
  Trash2,
} from 'lucide-react'

export default function MedicineDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { medicines, schedules, removeMedicine } = useStore()
  const med = medicines.find((m) => m.id === id)

  if (!med) {
    return (
      <div className="p-6 text-center text-gray-500">
        药品不存在
        <div className="mt-4">
          <button onClick={() => nav(-1)} className="text-brand-600 text-sm">
            返回
          </button>
        </div>
      </div>
    )
  }

  const sc = schedules.filter((s) => s.medicineId === med.id)

  return (
    <div className="pb-4">
      <PageHeader title="药品详情" />

      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${med.iconColor}`}>
              {med.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold">{med.name}</div>
              {med.brandName && (
                <div className="text-xs text-gray-500 mt-0.5">商品名：{med.brandName}</div>
              )}
              <div className="text-xs text-gray-500 mt-0.5">规格：{med.spec}</div>
              <div className="text-xs text-gray-500 mt-0.5">外观：{med.appearance}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Chip label="适应症" value={med.indication} />
            <Chip label="剂型" value={med.form} />
            <Chip label="效期" value={med.expiry.slice(0, 7)} />
          </div>
        </div>

        {/* 库存 */}
        <div className="mt-3 bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">当前库存</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-gray-900">{med.stock}</span>
                <span className="text-xs text-gray-400">{med.form === '胶囊' ? '粒' : '片'}</span>
                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${med.stockDays <= 3 ? 'bg-orange-50 text-meds-warn' : 'bg-emerald-50 text-meds-health'}`}>
                  约 {med.stockDays} 天用量
                </span>
              </div>
            </div>
            <button
              onClick={() => nav('/services/refill')}
              className="bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-1 active:scale-95"
            >
              <ShoppingBag size={16} /> 续方
            </button>
          </div>
        </div>

        {/* 用法 */}
        <Section icon={<Pill size={16} />} title="用法用量">
          <div className="text-sm text-gray-700 leading-relaxed">{med.usage}</div>
          {sc.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sc.map((s) => (
                <span
                  key={s.id}
                  className="text-xs bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full flex items-center gap-1"
                >
                  <Clock size={12} /> {s.time}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* 注意事项 */}
        <Section icon={<AlertTriangle size={16} />} title="注意事项" color="text-meds-warn">
          <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed">
            {med.precautions.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 相互作用 */}
        {med.interactions && med.interactions.length > 0 && (
          <Section icon={<Info size={16} />} title="药物相互作用" color="text-sky-600">
            <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed">
              {med.interactions.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 处方信息 */}
        <Section icon={<CalendarDays size={16} />} title="相关处方">
          <div className="text-sm text-gray-700">
            张建华 主任医师 · 2026-03-10 开具
            <button
              onClick={() => nav('/services/prescription')}
              className="ml-2 text-brand-600 text-xs"
            >
              查看完整处方
            </button>
          </div>
        </Section>

        {/* 危险操作 */}
        <div className="mt-4">
          <button
            onClick={() => {
              if (confirm('确认删除该药品？相关用药计划也会被移除。')) {
                removeMedicine(med.id)
                nav(-1)
              }
            }}
            className="w-full py-3 text-sm text-meds-danger bg-white rounded-2xl border border-red-100 flex items-center justify-center gap-1 active:scale-95"
          >
            <Trash2 size={16} /> 从药箱移除
          </button>
        </div>
      </div>
    </div>
  )
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl py-2">
      <div className="text-[10px] text-gray-400">{label}</div>
      <div className="text-sm font-medium text-gray-800 mt-0.5 truncate px-2">{value}</div>
    </div>
  )
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode
  title: string
  color?: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-3 bg-white rounded-2xl p-4 shadow-card">
      <div className={`flex items-center gap-1.5 text-sm font-medium mb-2 ${color ?? 'text-gray-700'}`}>
        {icon} {title}
      </div>
      {children}
    </div>
  )
}
