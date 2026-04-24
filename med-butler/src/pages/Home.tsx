import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  Sparkles,
  Heart,
  ClipboardList,
  Users,
  Stethoscope,
  Pill,
  CheckCircle2,
  Clock,
  SkipForward,
  AlertTriangle,
  Activity,
  Droplets,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx, getGreeting, formatTime, mealLabel } from '../utils'
import type { DoseLog, DoseStatus } from '../types'

export default function Home() {
  const nav = useNavigate()
  const {
    doseLogs,
    medicines,
    family,
    activeMemberId,
    healthRecords,
    elderMode,
    markDose,
  } = useStore()
  const me = family.find((f) => f.id === activeMemberId) ?? family[0]
  const [skipping, setSkipping] = useState<string | null>(null)

  const taken = doseLogs.filter((l) => l.status === 'taken').length
  const total = doseLogs.length
  const progress = total ? Math.round((taken / total) * 100) : 0

  const lowStock = medicines.filter((m) => m.stockDays <= 3)
  const latestBP = healthRecords.find((r) => r.type === 'bp')
  const latestBG = healthRecords.find((r) => r.type === 'bg')

  const groupByPeriod: Record<string, DoseLog[]> = {
    '早晨': doseLogs.filter((l) => l.time < '11:00'),
    '中午': doseLogs.filter((l) => l.time >= '11:00' && l.time < '14:00'),
    '下午': doseLogs.filter((l) => l.time >= '14:00' && l.time < '18:00'),
    '晚上': doseLogs.filter((l) => l.time >= '18:00'),
  }

  // 老人模式下精简后的快捷服务（保留续方、问诊两个最核心的）
  const quickServices = elderMode
    ? [
        { icon: Pill, label: '一键续方', to: '/services/refill', color: 'text-brand-600 bg-brand-50' },
        { icon: Stethoscope, label: '在线问诊', to: '/services/consult', color: 'text-sky-600 bg-sky-50' },
      ]
    : [
        { icon: Pill, label: '一键续方', to: '/services/refill', color: 'text-brand-600 bg-brand-50' },
        { icon: Stethoscope, label: '在线问诊', to: '/services/consult', color: 'text-sky-600 bg-sky-50' },
        { icon: ClipboardList, label: '电子处方', to: '/services/prescription', color: 'text-violet-600 bg-violet-50' },
        { icon: Users, label: '家人关怀', to: '/family', color: 'text-pink-600 bg-pink-50' },
      ]

  return (
    <div className="pb-4">
      {/* 顶部 Hero */}
      <div className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-orange-500 text-white px-4 pt-6 pb-14">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-90">美团 · 慢病用药小管家</div>
            <div className="text-lg font-semibold mt-0.5">
              {getGreeting(me?.name.replace('（本人）', '') ?? '您好')}
            </div>
          </div>
          <button
            onClick={() => nav('/me')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xl"
            aria-label="切换家人"
          >
            {me?.avatar}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <Bell size={16} />
          <span className="opacity-95">
            {lowStock.length > 0
              ? elderMode
                ? `${lowStock[0].name} 仅剩 ${lowStock[0].stockDays} 天用量`
                : `${lowStock[0].name} 仅剩 ${lowStock[0].stockDays} 天，建议今日续方`
              : '今日用药情况良好，继续加油！'}
          </span>
        </div>
      </div>

      {/* 进度卡 */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-card p-4 fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">今日用药进度</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-brand-600">{taken}</span>
                <span className="text-gray-400">/ {total}</span>
                <span className="text-xs text-gray-400 ml-2">已打卡</span>
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#ff8000"
                  strokeWidth="4"
                  strokeDasharray={`${(progress / 100) * 100.53} 100.53`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-brand-600">
                {progress}%
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 快捷服务（老人模式下 2 个核心入口，标准模式 4 个） */}
      <div className="px-4 mt-4">
        <div
          className={cx(
            'bg-white rounded-2xl shadow-card p-2 text-center',
            elderMode ? 'grid grid-cols-2' : 'grid grid-cols-4',
          )}
        >
          {quickServices.map((it) => (
            <button
              key={it.label}
              onClick={() => nav(it.to)}
              className={cx(
                'flex flex-col items-center gap-1 active:scale-95 transition',
                elderMode ? 'py-4' : 'py-2.5',
              )}
            >
              <div
                className={cx(
                  'rounded-xl flex items-center justify-center',
                  elderMode ? 'w-14 h-14' : 'w-10 h-10',
                  it.color,
                )}
              >
                <it.icon size={elderMode ? 28 : 20} />
              </div>
              <span className={cx('text-gray-700', elderMode ? 'text-base font-semibold' : 'text-xs')}>
                {it.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI 管家主动推送（营销型提示 · 仅标准模式显示，老人模式下已在 Hero 简化） */}
      {!elderMode && lowStock.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-br from-brand-50 to-white rounded-2xl p-4 border border-brand-100 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-100 rounded-full opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-2 text-brand-700 text-sm font-medium">
                <Sparkles size={16} /> AI 管家 · 智能提示
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                您的 <b>{lowStock[0].name}</b> 仅剩 <b>{lowStock[0].stockDays} 天</b>用量，
                电子处方仍在有效期，点击即可一键续方，<b>美团骑手 30 分钟送达</b>。
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => nav('/services/refill')}
                  className="flex-1 bg-brand-600 text-white py-2 rounded-xl text-sm font-medium active:scale-95"
                >
                  立即续方 ¥38
                </button>
                <button
                  onClick={() => nav('/chat')}
                  className="px-4 bg-white border border-brand-200 text-brand-700 py-2 rounded-xl text-sm active:scale-95"
                >
                  问问管家
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 老人模式：低库存时显示一个"沉稳版"续方按钮，不做营销化表达 */}
      {elderMode && lowStock.length > 0 && (
        <div className="px-4 mt-4">
          <button
            onClick={() => nav('/services/refill')}
            className="w-full bg-brand-600 text-white rounded-2xl px-4 py-4 flex items-center justify-between active:scale-[0.98]"
          >
            <div className="text-left">
              <div className="text-base font-bold">药快用完了，点此续方</div>
              <div className="text-sm opacity-90 mt-0.5">{lowStock[0].name} 剩 {lowStock[0].stockDays} 天</div>
            </div>
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* 今日用药 */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">今日用药</h2>
          <button
            onClick={() => nav('/schedule')}
            className="text-xs text-gray-500 flex items-center"
          >
            查看日程 <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(groupByPeriod).map(([period, logs]) =>
            logs.length === 0 ? null : (
              <div key={period}>
                <div className="text-xs text-gray-400 mb-1 px-1">{period}</div>
                <div className="space-y-2">
                  {logs.map((log) => (
                    <DoseItem
                      key={log.id}
                      log={log}
                      onMark={(s, r) => markDose(log.id, s, r)}
                      onSkip={() => setSkipping(log.id)}
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* 健康数据（标准模式：血压 + 血糖；老人模式：仅血压一张卡，减少干扰） */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">今日健康数据</h2>
          <button
            onClick={() => nav('/me')}
            className="text-xs text-gray-500 flex items-center"
          >
            录入记录 <ChevronRight size={14} />
          </button>
        </div>
        <div className={cx('grid gap-3', elderMode ? 'grid-cols-1' : 'grid-cols-2')}>
          <div className="bg-white rounded-2xl p-3 shadow-card">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Activity size={14} /> 血压
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-gray-900">
                {latestBP?.value ?? '—'}
              </span>
              <span className="text-xs text-gray-400">mmHg</span>
            </div>
            <div className="mt-1 text-xs text-meds-health">正常范围</div>
          </div>
          {!elderMode && (
            <div className="bg-white rounded-2xl p-3 shadow-card">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Droplets size={14} /> 空腹血糖
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-gray-900">
                  {latestBG?.value ?? '—'}
                </span>
                <span className="text-xs text-gray-400">mmol/L</span>
              </div>
              <div className="mt-1 text-xs text-meds-warn">略偏高</div>
            </div>
          )}
        </div>
      </div>

      {/* 家人状态 · 仅标准模式显示 */}
      {!elderMode && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold">家人用药状态</h2>
            <button
              onClick={() => nav('/family')}
              className="text-xs text-gray-500 flex items-center"
            >
              查看全部 <ChevronRight size={14} />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-card divide-y divide-gray-50">
            {family.filter((m) => m.id !== activeMemberId).slice(0, 2).map((m) => (
              <div key={m.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {m.diseases.join('、')} · 本周依从性 {m.adherence}%
                  </div>
                </div>
                {m.adherence < 80 && (
                  <span className="text-xs bg-orange-50 text-meds-warn px-2 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle size={12} /> 关注
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 科普小卡片 · 仅标准模式显示 */}
      {!elderMode && (
        <div className="px-4 mt-5">
          <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl p-4 border border-sky-100 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <Heart size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">血压控制小知识</div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                高血压患者应限制每日食盐 ≤ 5g，建议每周快走 150 分钟以上。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 跳过服药原因弹窗 */}
      {skipping && (
        <SkipDialog
          onClose={() => setSkipping(null)}
          onConfirm={(reason) => {
            markDose(skipping, 'skipped', reason)
            setSkipping(null)
          }}
        />
      )}
    </div>
  )
}

function DoseItem({
  log,
  onMark,
  onSkip,
}: {
  log: DoseLog
  onMark: (s: DoseStatus, r?: string) => void
  onSkip: () => void
}) {
  const medicines = useStore((s) => s.medicines)
  const elderMode = useStore((s) => s.elderMode)
  const med = medicines.find((m) => m.id === log.medicineId)

  const isTaken = log.status === 'taken'
  const isSkipped = log.status === 'skipped'

  return (
    <div
      className={cx(
        'rounded-2xl p-3 flex items-center gap-3 transition',
        isTaken && 'bg-emerald-50/60 border border-emerald-100',
        isSkipped && 'bg-gray-50 border border-gray-200',
        !isTaken && !isSkipped && 'bg-white shadow-card border border-gray-100',
      )}
    >
      <div className={cx('rounded-xl flex items-center justify-center', elderMode ? 'w-14 h-14 text-3xl' : 'w-11 h-11 text-2xl', med?.iconColor ?? 'bg-gray-100')}>
        {med?.emoji ?? '💊'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{log.medicineName}</span>
          {mealLabel(log.relativeToMeal) && (
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {mealLabel(log.relativeToMeal)}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-gray-500 flex items-center gap-1">
          <Clock size={12} /> {formatTime(log.time)} · {log.quantity} {med?.form === '胶囊' ? '粒' : '片'}
        </div>
      </div>
      {isTaken ? (
        <div className="flex items-center gap-1 text-meds-health text-xs font-medium">
          <CheckCircle2 size={18} /> 已服
        </div>
      ) : isSkipped ? (
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <SkipForward size={16} /> 已跳过
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onMark('taken')}
            className={cx(
              'bg-brand-600 text-white rounded-full font-medium active:scale-95',
              elderMode ? 'text-base px-5 py-2.5' : 'text-xs px-3 py-1.5',
            )}
          >
            我吃了
          </button>
          <button
            onClick={onSkip}
            className={cx(
              'bg-gray-100 text-gray-500 rounded-full active:scale-95',
              elderMode ? 'text-sm px-3 py-2' : 'text-xs px-2.5 py-1.5',
            )}
          >
            跳过
          </button>
        </div>
      )}
    </div>
  )
}

function SkipDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  const reasons = ['忘记了', '身体不适', '外出未带', '医生建议', '其他']
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end max-w-[440px] mx-auto">
      <div className="w-full bg-white rounded-t-2xl p-4 pb-6 fade-in-up">
        <div className="text-center text-base font-semibold">跳过本次服药的原因</div>
        <div className="mt-2 text-center text-xs text-gray-500">
          我们将记录此次情况，并在必要时提供补服建议
        </div>
        <div className="mt-4 space-y-2">
          {reasons.map((r) => (
            <button
              key={r}
              onClick={() => onConfirm(r)}
              className="w-full py-3 bg-gray-50 rounded-xl text-sm active:bg-gray-100"
            >
              {r}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full py-3 text-gray-400 text-sm"
        >
          取消
        </button>
      </div>
    </div>
  )
}
