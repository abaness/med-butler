import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import {
  Truck,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  Store,
  ChevronRight,
} from 'lucide-react'
import { cx } from '../utils'

type Step = 'select' | 'prescreen' | 'confirm' | 'success'

export default function Refill() {
  const nav = useNavigate()
  const { medicines } = useStore()
  const [step, setStep] = useState<Step>('select')
  const [selected, setSelected] = useState<string[]>(
    medicines.filter((m) => m.stockDays <= 7).map((m) => m.id),
  )

  const items = medicines.filter((m) => selected.includes(m.id))
  const total = useMemo(() => items.reduce((s, m) => s + (m.name.length * 8 + 22), 0), [items])

  if (step === 'success') {
    return (
      <div className="pb-4 min-h-screen bg-white">
        <PageHeader title="下单成功" onBack={() => nav('/')} />
        <div className="flex flex-col items-center pt-14 px-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={40} />
          </div>
          <div className="mt-4 text-lg font-semibold">续方成功</div>
          <div className="mt-1 text-sm text-gray-500">
            骑手已接单，预计 <b className="text-brand-600">28 分钟</b>送达
          </div>
          <div className="mt-6 w-full bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
              <Sparkles size={16} /> AI 管家已为您
            </div>
            <ul className="mt-2 space-y-1 text-xs text-gray-600 leading-relaxed">
              <li>· 已更新您的用药计划与库存信息</li>
              <li>· 将在新药到达后自动开始提醒</li>
              <li>· 电子处方已归档至"服务-电子处方"</li>
            </ul>
          </div>
          <button
            onClick={() => nav('/')}
            className="mt-6 w-full bg-brand-600 text-white rounded-2xl py-3 text-sm font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-4">
      <PageHeader title="一键续方" />
      <div className="px-4 pt-3">
        {/* 步骤条 */}
        <div className="flex items-center gap-2 text-xs mb-3">
          <Stepper active label="1 选药" done={step !== 'select'} current={step === 'select'} />
          <div className="flex-1 h-px bg-gray-200" />
          <Stepper active={step !== 'select'} label="2 AI 预问诊" done={step === 'confirm'} current={step === 'prescreen'} />
          <div className="flex-1 h-px bg-gray-200" />
          <Stepper active={step === 'confirm'} label="3 下单" current={step === 'confirm'} />
        </div>
      </div>

      {step === 'select' && (
        <div className="px-4 space-y-3">
          <div className="bg-brand-50 rounded-2xl p-3 border border-brand-100 text-sm text-brand-700 flex items-center gap-2">
            <Sparkles size={16} /> AI 已根据库存和处方为您勾选需续方的药品
          </div>
          <div className="space-y-2">
            {medicines.map((m) => {
              const checked = selected.includes(m.id)
              return (
                <label
                  key={m.id}
                  className={cx(
                    'flex items-center gap-3 bg-white rounded-2xl p-3 shadow-card cursor-pointer',
                    checked && 'ring-2 ring-brand-500',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id],
                      )
                    }
                    className="w-5 h-5 accent-brand-600"
                  />
                  <div className={cx('w-10 h-10 rounded-xl flex items-center justify-center text-xl', m.iconColor)}>
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.spec}</div>
                  </div>
                  <div className="text-right">
                    <div className={cx('text-sm font-medium', m.stockDays <= 3 ? 'text-meds-warn' : 'text-gray-700')}>
                      剩 {m.stockDays} 天
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
          <button
            disabled={selected.length === 0}
            onClick={() => setStep('prescreen')}
            className={cx(
              'w-full rounded-2xl py-3 text-sm font-medium mt-2',
              selected.length === 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-brand-600 text-white active:scale-95',
            )}
          >
            下一步（已选 {selected.length} 项）
          </button>
        </div>
      )}

      {step === 'prescreen' && (
        <div className="px-4 space-y-3">
          <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
              <Sparkles size={16} /> AI 预问诊
            </div>
            <div className="mt-2 text-xs text-gray-500">
              为了判断是否继续使用原方，请回答 3 个简单问题：
            </div>
          </div>

          <Question
            q="近一周，您的血压是否稳定在 140/90 以下？"
            options={['是', '偶尔偏高', '经常偏高']}
            default_="是"
          />
          <Question
            q="是否有头晕、乏力、咳嗽等不适症状？"
            options={['无', '轻微', '明显']}
            default_="无"
          />
          <Question
            q="本次续方是否需要调整剂量？"
            options={['不需要', '需要医生评估']}
            default_="不需要"
          />

          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 text-sm text-meds-health flex items-center gap-2">
            <CheckCircle2 size={16} /> 评估结果：可继续原方，处方仍在有效期内
          </div>

          <button
            onClick={() => setStep('confirm')}
            className="w-full bg-brand-600 text-white rounded-2xl py-3 text-sm font-medium active:scale-95"
          >
            下一步：确认订单
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="px-4 space-y-3">
          <div className="bg-white rounded-2xl shadow-card p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} className="text-brand-600" /> 配送地址
            </div>
            <div className="mt-2 text-sm">
              李先生 · 138****1234
              <div className="text-xs text-gray-500 mt-0.5">
                北京市朝阳区望京 SOHO T3 · 30 层
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Store size={16} className="text-brand-600" /> 优选药店
              </div>
              <span className="text-xs text-brand-600">切换</span>
            </div>
            <div className="mt-2 text-sm">
              康佳大药房（朝阳门店）
              <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                <Clock size={12} /> 28 分钟送达 · 距您 1.2 公里
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-3">
            <div className="text-sm font-medium mb-2">续方药品 ({items.length})</div>
            <div className="space-y-2">
              {items.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={cx('w-9 h-9 rounded-lg flex items-center justify-center text-lg', m.iconColor)}>
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{m.name}</div>
                    <div className="text-xs text-gray-400">{m.spec}</div>
                  </div>
                  <span className="text-sm">× 1 盒</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm flex items-center justify-between">
              <span className="text-gray-500">商品金额</span>
              <span>¥{total.toFixed(2)}</span>
            </div>
            <div className="text-sm flex items-center justify-between mt-1">
              <span className="text-gray-500">骑手配送费</span>
              <span>¥3.00</span>
            </div>
            <div className="text-sm flex items-center justify-between mt-1 text-meds-health">
              <span>慢病关爱会员</span>
              <span>- ¥3.00</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-3">
            <div className="text-sm font-medium mb-2">支付方式</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck size={16} className="text-brand-600" />
                医保个人账户支付
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>

          {/* 底部总价 */}
          <div className="fixed left-0 right-0 bottom-0 max-w-[440px] mx-auto bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">合计</div>
              <div className="text-lg font-bold text-brand-600">¥{total.toFixed(2)}</div>
            </div>
            <button
              onClick={() => setStep('success')}
              className="bg-brand-600 text-white rounded-full px-6 py-3 text-sm font-medium active:scale-95 flex items-center gap-1"
            >
              <Truck size={16} /> 提交订单
            </button>
          </div>
          <div className="h-20" />
        </div>
      )}
    </div>
  )
}

function Stepper({ label, current, done }: { active?: boolean; label: string; current?: boolean; done?: boolean }) {
  return (
    <div
      className={cx(
        'px-2 py-1 rounded-full text-[11px]',
        done && 'bg-emerald-50 text-meds-health',
        current && !done && 'bg-brand-50 text-brand-600 font-medium',
        !current && !done && 'bg-gray-100 text-gray-400',
      )}
    >
      {label}
    </div>
  )
}

function Question({ q, options, default_ }: { q: string; options: string[]; default_: string }) {
  const [v, setV] = useState(default_)
  return (
    <div className="bg-white rounded-2xl p-3 shadow-card">
      <div className="text-sm">{q}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setV(o)}
            className={cx(
              'px-3 py-1.5 rounded-full text-xs',
              v === o ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
