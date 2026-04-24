import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx, formatTime, mealLabel } from '../utils'
import { weeklyAdherence } from '../data/mockData'

type Tab = 'today' | 'month' | 'report'

export default function Schedule() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="pb-4">
      <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-lg font-semibold">用药日程</h1>
        <div className="mt-3 flex items-center gap-1 bg-gray-100 rounded-full p-1 text-xs">
          {([
            ['today', '今日'],
            ['month', '月视图'],
            ['report', '依从性报告'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cx(
                'flex-1 py-1.5 rounded-full transition',
                tab === k ? 'bg-white text-brand-600 font-medium shadow' : 'text-gray-500',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'today' && <TodayView />}
      {tab === 'month' && <MonthView />}
      {tab === 'report' && <ReportView />}
    </div>
  )
}

function TodayView() {
  const { doseLogs, medicines, markDose } = useStore()

  return (
    <div className="px-4 pt-4 space-y-2">
      {doseLogs.map((log) => {
        const med = medicines.find((m) => m.id === log.medicineId)
        const isTaken = log.status === 'taken'
        const isSkipped = log.status === 'skipped'
        return (
          <div
            key={log.id}
            className={cx(
              'rounded-2xl p-3 flex items-center gap-3',
              isTaken && 'bg-emerald-50/60 border border-emerald-100',
              isSkipped && 'bg-gray-50 border border-gray-200',
              !isTaken && !isSkipped && 'bg-white shadow-card',
            )}
          >
            <div className="flex flex-col items-center w-12 shrink-0">
              <div className="text-xs text-gray-400">{formatTime(log.time).split(' ')[0]}</div>
              <div className="text-sm font-semibold">{log.time}</div>
            </div>
            <div className={cx('w-10 h-10 rounded-xl flex items-center justify-center text-xl', med?.iconColor ?? 'bg-gray-100')}>
              {med?.emoji ?? '💊'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{log.medicineName}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {log.quantity} {med?.form === '胶囊' ? '粒' : '片'}
                {mealLabel(log.relativeToMeal) && ` · ${mealLabel(log.relativeToMeal)}`}
              </div>
            </div>
            {isTaken ? (
              <div className="flex items-center gap-1 text-meds-health text-xs font-medium">
                <CheckCircle2 size={16} /> 已服
              </div>
            ) : isSkipped ? (
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <XCircle size={16} /> 已跳过
              </div>
            ) : (
              <button
                onClick={() => markDose(log.id, 'taken')}
                className="bg-brand-600 text-white text-xs px-3 py-1.5 rounded-full font-medium active:scale-95"
              >
                我吃了
              </button>
            )}
          </div>
        )
      })}

      <div className="pt-2 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <Clock size={12} /> 下次提醒将在 19:00 自动推送
      </div>
    </div>
  )
}

function MonthView() {
  const elderMode = useStore((s) => s.elderMode)
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = firstDay.getDay()

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = i - firstWeekday + 1
    if (d < 1 || d > daysInMonth) return null
    return d
  })

  const seed = useMemo(() => {
    const m: Record<number, 'full' | 'partial' | 'miss'> = {}
    for (let i = 1; i <= daysInMonth; i++) {
      if (i > today.getDate()) continue
      const r = Math.random()
      m[i] = r < 0.78 ? 'full' : r < 0.93 ? 'partial' : 'miss'
    }
    m[today.getDate()] = 'partial'
    return m
  }, [daysInMonth, today])

  return (
    <div className="px-4 pt-4">
      <div className="bg-white rounded-2xl shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold">
            {year} 年 {month + 1} 月
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <LegendDot color="bg-emerald-500" label="全服" />
            <LegendDot color="bg-orange-400" label="部分" />
            <LegendDot color="bg-red-400" label="漏服" />
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => {
            if (d === null) return <div key={i} className="aspect-square" />
            const status = seed[d]
            const isToday = d === today.getDate()
            return (
              <div
                key={i}
                className={cx(
                  'aspect-square rounded-lg flex flex-col items-center justify-center relative',
                  isToday && 'ring-2 ring-brand-500',
                  status === 'full' && 'bg-emerald-50 text-emerald-700',
                  status === 'partial' && 'bg-orange-50 text-orange-700',
                  status === 'miss' && 'bg-red-50 text-red-700',
                  !status && 'bg-gray-50 text-gray-300',
                )}
              >
                <span className="text-xs font-medium">{d}</span>
                {status && (
                  <div className={cx(
                    'w-1 h-1 rounded-full mt-0.5',
                    status === 'full' && 'bg-emerald-500',
                    status === 'partial' && 'bg-orange-400',
                    status === 'miss' && 'bg-red-400',
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 连续打卡奖励卡 · 老人模式隐藏（营销化激励，非核心信息） */}
      {!elderMode && (
        <div className="mt-4 bg-gradient-to-br from-brand-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 text-sm">
            <Award size={18} /> 本月连续打卡 <b className="text-lg">18</b> 天
          </div>
          <div className="mt-1 text-xs opacity-95">保持好习惯，健康自然来</div>
        </div>
      )}
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={cx('w-2 h-2 rounded-full', color)} />
      <span>{label}</span>
    </div>
  )
}

function ReportView() {
  const elderMode = useStore((s) => s.elderMode)
  const avg = Math.round(weeklyAdherence.reduce((s, d) => s + d.value, 0) / weeklyAdherence.length)
  const max = Math.max(...weeklyAdherence.map((d) => d.value))

  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="bg-white rounded-2xl shadow-card p-4">
        <div className="text-xs text-gray-500">本周平均依从性</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-brand-600">{avg}%</span>
          <span className="text-xs text-meds-health flex items-center gap-0.5">
            <TrendingUp size={12} /> +5%
          </span>
        </div>
        {elderMode ? (
          <div className="mt-3 text-sm text-gray-700 leading-relaxed">
            本周一共 <b>{weeklyAdherence.length}</b> 天，
            按时吃药的比例是 <b className="text-brand-600">{avg}%</b>，比上周有进步。
          </div>
        ) : (
          <div className="mt-3 flex items-end gap-2 h-28">
            {weeklyAdherence.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex-1 flex items-end">
                  <div
                    className={cx(
                      'w-full rounded-t-md',
                      d.value === max ? 'bg-brand-500' : 'bg-brand-200',
                    )}
                    style={{ height: `${d.value}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-500">{d.day}</div>
                <div className="text-[10px] text-gray-400">{d.value}%</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 健康数据趋势 · 老人模式下隐藏（多指标并列看不清，首页已有血压卡片） */}
      {!elderMode && (
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="text-sm font-medium mb-3">健康数据趋势</div>
          <div className="grid grid-cols-2 gap-3">
            <TrendTile title="收缩压" value="128 mmHg" delta="-4" hint="近 7 日平均" />
            <TrendTile title="空腹血糖" value="6.8 mmol/L" delta="+0.3" hint="近 3 日平均" warn />
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-brand-700">
          <Sparkles size={16} /> AI 管家 · 周报建议
        </div>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed">
          <li>· 本周漏服两次晚间辛伐他汀，建议将提醒提前至 21:30</li>
          <li>· 空腹血糖连续两日偏高，请留意饮食与睡眠，必要时联系医生</li>
          <li>· 本月处方即将到期（2026-06-10），可在"服务-续方"中提前续方</li>
        </ul>
      </div>

      {/* 导出 PDF · 老人模式隐藏（面向子女/医生的分享功能） */}
      {!elderMode && (
        <button className="w-full bg-white text-brand-700 border border-brand-200 rounded-2xl py-3 text-sm active:scale-95">
          导出为 PDF 发送给家庭医生
        </button>
      )}
    </div>
  )
}

function TrendTile({
  title,
  value,
  delta,
  hint,
  warn,
}: {
  title: string
  value: string
  delta: string
  hint: string
  warn?: boolean
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
      <div className={cx('text-xs mt-0.5 flex items-center gap-0.5', warn ? 'text-meds-warn' : 'text-meds-health')}>
        <TrendingUp size={12} /> {delta} · {hint}
      </div>
    </div>
  )
}
