import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import {
  Settings,
  Bell,
  ShieldCheck,
  HeartPulse,
  UserCog,
  FileText,
  HelpCircle,
  ChevronRight,
  Users,
  Sparkles,
  Info,
  RefreshCw,
  Activity,
  Droplets,
} from 'lucide-react'
import { cx } from '../utils'

export default function Profile() {
  const nav = useNavigate()
  const { family, activeMemberId, elderMode, toggleElderMode, resetAll, healthRecords } = useStore()
  const me = family.find((f) => f.id === activeMemberId) ?? family[0]

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 px-4 pt-5 pb-12">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-3xl shadow-sm">
            {me.avatar}
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{me.name}</div>
            <div className="text-xs text-gray-700 mt-0.5">
              {me.age}岁 · {me.diseases.join(' · ')}
            </div>
            <div className="text-xs text-gray-700 mt-0.5">
              管家陪伴您第 <b className="text-gray-900">186</b> 天
            </div>
          </div>
          <button onClick={() => nav('/family')} className="p-2 rounded-full bg-white/70 shadow-sm">
            <Users size={18} />
          </button>
        </div>
      </div>

      {/* 快捷功能 —— 老人模式下仅保留"健康档案"一个入口，其余收纳 */}
      <div className="px-4 -mt-7">
        <div className={cx(
          'bg-white rounded-2xl shadow-card p-4 text-center',
          elderMode ? 'grid grid-cols-2' : 'grid grid-cols-4',
        )}>
          {[
            { icon: HeartPulse, label: '健康档案', color: 'text-rose-600 bg-rose-50' },
            { icon: FileText, label: '电子处方', color: 'text-violet-600 bg-violet-50', to: '/services/prescription', elderHide: true },
            { icon: Bell, label: '提醒设置', color: 'text-sky-600 bg-sky-50', elderHide: true },
            { icon: ShieldCheck, label: '隐私保护', color: 'text-emerald-600 bg-emerald-50' },
          ].filter((it) => !(elderMode && it.elderHide)).map((it) => (
            <button
              key={it.label}
              onClick={() => it.to && nav(it.to)}
              className="py-2.5 flex flex-col items-center gap-1 active:scale-95 transition"
            >
              <div className={cx('w-10 h-10 rounded-xl flex items-center justify-center', it.color)}>
                <it.icon size={20} />
              </div>
              <span className="text-xs text-gray-700">{it.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 健康档案片 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold flex items-center gap-1">
              <HeartPulse size={16} className="text-rose-500" /> 健康档案
            </div>
            <span className="text-xs text-gray-400 flex items-center">
              详情 <ChevronRight size={14} />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric
              icon={<Activity size={14} />}
              label="最近血压"
              value={healthRecords.find((h) => h.type === 'bp')?.value ?? '—'}
              unit="mmHg"
            />
            <MiniMetric
              icon={<Droplets size={14} />}
              label="最近血糖"
              value={healthRecords.find((h) => h.type === 'bg')?.value ?? '—'}
              unit="mmol/L"
            />
          </div>
          <button className="mt-3 w-full bg-brand-50 text-brand-600 rounded-xl py-2 text-sm font-medium active:scale-95">
            + 录入今日数据
          </button>
        </div>
      </div>

      {/* 老人模式 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCog size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">老人模式</div>
              <div className="text-xs text-gray-600 mt-0.5">
                适度放大字号、加粗文字，隐藏营销与复杂卡片
              </div>
            </div>
            <Switch on={elderMode} onToggle={toggleElderMode} />
          </div>
        </div>
      </div>

      {/* 提醒设置 —— 老人模式下仅显示"帮助与反馈" */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-card divide-y divide-gray-50">
          {!elderMode && (
            <>
              <SettingRow
                icon={<Bell size={18} className="text-sky-600" />}
                label="提醒渠道"
                value="App + 微信 + 短信"
              />
              <SettingRow
                icon={<Sparkles size={18} className="text-brand-600" />}
                label="AI 管家主动服务"
                value="早安播报 · 晚安总结"
              />
              <SettingRow
                icon={<Settings size={18} className="text-gray-500" />}
                label="个性化偏好"
                value="温和关怀型"
              />
            </>
          )}
          <SettingRow
            icon={<HelpCircle size={18} className="text-gray-500" />}
            label="帮助与反馈"
          />
          {!elderMode && (
            <SettingRow
              icon={<Info size={18} className="text-gray-500" />}
              label="关于慢病用药小管家"
              value="V1.0 演示版"
            />
          )}
          <button
            onClick={() => {
              if (confirm('确认重置所有演示数据？')) {
                resetAll()
                nav('/')
              }
            }}
            className="w-full py-3 px-4 text-left flex items-center gap-3 text-sm text-gray-500 active:bg-gray-50"
          >
            <RefreshCw size={18} className="text-gray-500" /> 重置演示数据
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-6">
        美团医药 · 让慢病用药，不再靠记性
      </div>
    </div>
  )
}

function MiniMetric({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="text-xs text-gray-500 flex items-center gap-1">{icon} {label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-semibold text-gray-900">{value}</span>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
    </div>
  )
}

function SettingRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <button className="w-full py-3 px-4 flex items-center gap-3 text-sm active:bg-gray-50">
      {icon}
      <span className="flex-1 text-left text-gray-900">{label}</span>
      {value && <span className="text-gray-400 text-xs">{value}</span>}
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  )
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cx(
        'toggle-switch relative w-11 h-6 rounded-full transition shrink-0',
        on ? 'bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500' : 'bg-gray-200',
      )}
      aria-pressed={on}
    >
      <span
        className={cx(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
          on && 'translate-x-5',
        )}
      />
    </button>
  )
}
