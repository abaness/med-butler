import { useNavigate } from 'react-router-dom'
import {
  Pill,
  Stethoscope,
  FileText,
  ChevronRight,
  Truck,
  Sparkles,
  Heart,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx } from '../utils'

export default function Services() {
  const nav = useNavigate()
  const { medicines, prescriptions, elderMode } = useStore()
  const lowStock = medicines.filter((m) => m.stockDays <= 3)

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-orange-500 text-white px-4 pt-5 pb-10">
        <h1 className="text-lg font-semibold">健康服务</h1>
        <div className="mt-1 text-xs opacity-90">美团医药 · 闭环服务，省心省事</div>
      </div>

      {/* 主推续方 */}
      <div className="px-4 -mt-6">
        <button
          onClick={() => nav('/services/refill')}
          className="w-full bg-white rounded-2xl shadow-card p-4 text-left active:scale-[0.99] fade-in-up"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Pill size={24} />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold flex items-center gap-2">
                一键续方
                <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-full">
                  <Truck size={10} className="inline mr-0.5" /> 30 分钟达
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {lowStock.length > 0
                  ? `${lowStock.length} 款药品即将用完，建议立即续方`
                  : '暂无急需续方的药品'}
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniCell label="AI 预问诊" icon={<Sparkles size={14} />} />
            <MiniCell label="骑手极速送" icon={<Truck size={14} />} />
            <MiniCell label="医保可报销" icon={<ShieldCheck size={14} />} />
          </div>
        </button>
      </div>

      {/* 其他服务 */}
      <div className="px-4 mt-3 space-y-3">
        <ServiceRow
          icon={<Stethoscope size={22} />}
          color="bg-sky-50 text-sky-600"
          title="在线问诊"
          desc="接入美团互联网医院，3000+ 慢病专家在线"
          onClick={() => nav('/services/consult')}
        />
        <ServiceRow
          icon={<FileText size={22} />}
          color="bg-violet-50 text-violet-600"
          title="电子处方"
          desc={`${prescriptions.length} 份有效处方 · 自动归档`}
          onClick={() => nav('/services/prescription')}
        />
        <ServiceRow
          icon={<CalendarCheck size={22} />}
          color="bg-emerald-50 text-emerald-600"
          title="复诊预约"
          desc="可预约线上 / 线下复诊时段"
          onClick={() => nav('/services/consult')}
        />
        {!elderMode && (
          <ServiceRow
            icon={<Heart size={22} />}
            color="bg-rose-50 text-rose-600"
            title="慢病专区商城"
            desc="血压计、血糖仪、慢病食品等"
            onClick={() => {}}
          />
        )}
      </div>

      {/* 慢病关爱计划 · 仅标准模式（会员营销内容） */}
      {!elderMode && (
        <div className="px-4 mt-5">
          <div className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-2xl p-4">
            <div className="text-sm font-semibold">慢病关爱计划 · 会员专属</div>
            <div className="mt-1 text-xs opacity-90 leading-relaxed">
              会员专享：全月免运费 + 专属家庭医生 + 慢病保险限时 9 折
            </div>
            <button className="mt-3 bg-white text-sky-700 text-xs font-medium px-3 py-1.5 rounded-full">
              立即开通 ¥9/月
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ServiceRow({
  icon,
  color,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode
  color: string
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-card p-3 flex items-center gap-3 active:scale-[0.99]"
    >
      <div className={cx('w-11 h-11 rounded-xl flex items-center justify-center', color)}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  )
}

function MiniCell({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl py-2 flex flex-col items-center gap-1 text-[11px] text-gray-600">
      <span className="text-brand-600">{icon}</span>
      {label}
    </div>
  )
}
