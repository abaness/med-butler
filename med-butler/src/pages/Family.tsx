import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import {
  UserPlus,
  Activity,
  AlertTriangle,
  Heart,
  Bell,
  Share2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { cx } from '../utils'

export default function Family() {
  const { family, activeMemberId, setActiveMember, elderMode } = useStore()
  const [showInvite, setShowInvite] = useState(false)

  return (
    <div className="pb-4">
      <PageHeader
        title="家人关怀"
        right={
          <button
            onClick={() => setShowInvite(true)}
            className="bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1 active:scale-95"
          >
            <UserPlus size={14} /> 邀请
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Hero 聚合卡片：老人模式下隐藏（对老人无意义的汇总指标） */}
        {!elderMode && (
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 text-sm">
              <Heart size={18} fill="currentColor" /> 家人关怀计划
            </div>
            <div className="mt-1 text-xs opacity-95 leading-relaxed">
              远程协助家人管理用药，异地也能安心照顾爸妈
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat label="家庭成员" value={family.length.toString()} />
              <Stat label="本周平均依从性" value={`${Math.round(family.reduce((s, f) => s + f.adherence, 0) / family.length)}%`} />
              <Stat label="待提醒" value="1" />
            </div>
          </div>
        )}

        <div className={cx('space-y-3', elderMode ? 'mt-0' : 'mt-4')}>
          {family.map((f) => (
            <div
              key={f.id}
              className={cx(
                'bg-white rounded-2xl shadow-card p-4 border-2',
                f.id === activeMemberId ? 'border-brand-500' : 'border-transparent',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-2xl">
                  {f.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{f.name}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {f.relation} · {f.age}岁
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {f.diseases.join(' · ')} · {f.medicineCount} 种用药
                  </div>
                </div>
                {f.id === activeMemberId ? (
                  <span className="text-xs text-brand-600 font-medium">当前</span>
                ) : (
                  <button
                    onClick={() => setActiveMember(f.id)}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                  >
                    切换
                  </button>
                )}
              </div>

              <div className="mt-3 bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">本周依从性</span>
                  <span className={cx('font-semibold', f.adherence < 80 ? 'text-meds-warn' : 'text-meds-health')}>
                    {f.adherence}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className={cx(
                      'h-full rounded-full',
                      f.adherence < 80
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-400 to-emerald-500',
                    )}
                    style={{ width: `${f.adherence}%` }}
                  />
                </div>
              </div>

              {f.adherence < 80 && (
                <div className="mt-2 bg-orange-50 text-meds-warn text-xs rounded-xl p-2 flex items-start gap-1.5">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>本周漏服 3 次，建议通过"远程提醒"推送语音问候。</span>
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <ActionBtn icon={<Activity size={14} />} label="健康数据" />
                <ActionBtn icon={<Bell size={14} />} label="远程提醒" />
                <ActionBtn icon={<ShoppingBag size={14} />} label="代下单" />
              </div>
            </div>
          ))}
        </div>

        {/* AI 管家洞察 · 仅标准模式（主要面向子女视角的分析性内容） */}
        {!elderMode && (
          <div className="mt-4 bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
              <Sparkles size={16} /> AI 管家洞察
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-600 leading-relaxed">
              <li>· 李伯伯本周依从性下降明显，建议您致电关心并同步服药计划</li>
              <li>· 王阿姨的血糖数据偏高，可安排线上复诊以调整药量</li>
              <li>· 两位老人可合并一起下单，节省配送费</li>
            </ul>
          </div>
        )}
      </div>

      {showInvite && <InviteSheet onClose={() => setShowInvite(false)} />}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 rounded-xl py-2">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] opacity-90">{label}</div>
    </div>
  )
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="bg-gray-50 rounded-lg py-2 flex items-center justify-center gap-1 text-gray-700 active:scale-95">
      <span className="text-brand-600">{icon}</span>
      {label}
    </button>
  )
}

function InviteSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end max-w-[440px] mx-auto">
      <div className="w-full bg-white rounded-t-2xl p-5 pb-6 fade-in-up">
        <div className="text-center text-base font-semibold">邀请家人加入</div>
        <div className="mt-1 text-xs text-gray-500 text-center">
          发送专属邀请码，成为彼此的健康守护者
        </div>
        <div className="mt-5 bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 rounded-2xl p-5 text-gray-900 text-center">
          <div className="text-xs text-gray-700">邀请码</div>
          <div className="mt-1 text-3xl font-bold tracking-widest">MTX-3829</div>
          <div className="mt-2 text-xs text-gray-700">3 天内有效</div>
        </div>
        <button className="mt-4 w-full bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-1">
          <Share2 size={16} /> 分享给家人
        </button>
        <button onClick={onClose} className="mt-2 w-full py-3 text-gray-400 text-sm">
          关闭
        </button>
      </div>
    </div>
  )
}

