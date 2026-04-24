import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import {
  Camera,
  ShoppingBag,
  Keyboard,
  Sparkles,
  CheckCircle2,
  Loader2,
  Plus,
  Clock,
  Pill,
} from 'lucide-react'
import { cx } from '../utils'
import type { Medicine } from '../types'

type Mode = 'choose' | 'ocr' | 'order' | 'manual' | 'confirm'

const demoTimes = ['08:00', '12:30', '19:00', '22:00']

export default function MedicineAdd() {
  const nav = useNavigate()
  const { orders, importOrder, addMedicineWithSchedule } = useStore()
  const [mode, setMode] = useState<Mode>('choose')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [draft, setDraft] = useState<Medicine | null>(null)
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['08:00'])
  const [manualName, setManualName] = useState('')

  const startOcr = () => {
    setMode('ocr')
    setOcrLoading(true)
    setTimeout(() => {
      setOcrLoading(false)
      const recognized: Medicine = {
        id: `m-ocr-${Date.now()}`,
        name: '氨氯地平片',
        brandName: '络活喜',
        spec: '5mg × 7片/盒',
        form: '片剂',
        color: '白色',
        appearance: '白色圆形薄膜衣片',
        indication: '原发性高血压',
        usage: '每日一次，每次 1 片',
        precautions: ['可能引起踝部水肿', '与葡萄柚同服可能增加血药浓度'],
        interactions: [],
        stock: 7,
        stockDays: 7,
        expiry: '2027-08-10',
        addedFrom: 'ocr',
        iconColor: 'bg-indigo-100',
        emoji: '💊',
      }
      setDraft(recognized)
      setSelectedTimes(['08:00'])
      setMode('confirm')
    }, 1500)
  }

  const startOrderImport = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    importOrder(orderId)
    const item = order.items[0]
    const draftMed: Medicine = {
      id: `m-ord-${Date.now()}`,
      name: item.name.split(' ')[0],
      brandName: '',
      spec: item.spec,
      form: '片剂',
      indication: '慢病用药',
      usage: '遵医嘱',
      precautions: ['按时服用，不可漏服'],
      stock: item.quantity * 7,
      stockDays: item.quantity * 7,
      expiry: '2027-12-01',
      addedFrom: 'order',
      iconColor: item.iconColor,
      emoji: item.emoji,
    }
    setDraft(draftMed)
    setSelectedTimes(['08:00'])
    setMode('confirm')
  }

  const startManual = () => {
    if (!manualName.trim()) {
      alert('请输入药品名称')
      return
    }
    const draftMed: Medicine = {
      id: `m-manual-${Date.now()}`,
      name: manualName.trim(),
      spec: '规格未填写',
      form: '片剂',
      indication: '请补充',
      usage: '每日一次，每次 1 片',
      precautions: ['请按说明书或医嘱服用'],
      stock: 30,
      stockDays: 30,
      expiry: '2027-12-01',
      addedFrom: 'manual',
      iconColor: 'bg-gray-100',
      emoji: '💊',
    }
    setDraft(draftMed)
    setSelectedTimes(['08:00'])
    setMode('confirm')
  }

  const confirmAdd = () => {
    if (!draft) return
    addMedicineWithSchedule(draft, selectedTimes)
    nav('/medicine')
  }

  if (mode === 'confirm' && draft) {
    return (
      <div className="pb-4">
        <PageHeader title="确认药品信息" onBack={() => setMode('choose')} />
        <div className="px-4 pt-4">
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-3 flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            <span>
              {draft.addedFrom === 'ocr' && '已为您识别药盒信息，请核对后确认'}
              {draft.addedFrom === 'order' && '已从美团买药订单为您自动建立档案'}
              {draft.addedFrom === 'manual' && '已保存基本信息，可进一步补充'}
            </span>
          </div>

          <div className="mt-3 bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-start gap-3">
              <div className={cx('w-14 h-14 rounded-xl flex items-center justify-center text-3xl', draft.iconColor)}>
                {draft.emoji}
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold">{draft.name}</div>
                {draft.brandName && (
                  <div className="text-xs text-gray-500 mt-0.5">商品名：{draft.brandName}</div>
                )}
                <div className="text-xs text-gray-500 mt-0.5">规格：{draft.spec}</div>
                <div className="text-xs text-gray-500 mt-0.5">适应症：{draft.indication}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Sparkles size={16} className="text-brand-600" /> AI 医嘱解析
            </div>
            <div className="mt-2 text-sm text-gray-700 leading-relaxed">
              {draft.usage}
            </div>
            <div className="mt-3 text-xs text-gray-500">推荐提醒时间（可调整）</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {demoTimes.map((t) => {
                const active = selectedTimes.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() =>
                      setSelectedTimes((prev) =>
                        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                      )
                    }
                    className={cx(
                      'px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition',
                      active
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-600',
                    )}
                  >
                    <Clock size={12} /> {t}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              提醒渠道：App 推送 + 微信服务号 + 短信（可在"我的"中调整）
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={confirmAdd}
              className="w-full bg-brand-600 text-white rounded-2xl py-3 text-sm font-medium active:scale-95"
            >
              确认加入药箱，开始提醒
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'ocr') {
    return (
      <div className="pb-4">
        <PageHeader title="拍照录入药品" onBack={() => setMode('choose')} />
        <div className="px-4 pt-6">
          <div className="bg-black rounded-2xl aspect-[4/3] relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-white/40 rounded-xl" />
            <div className="text-white/70 text-center">
              <Camera size={36} className="mx-auto" />
              <div className="text-xs mt-2">（演示模拟：正在识别"氨氯地平"药盒）</div>
            </div>
            {ocrLoading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-sm gap-2">
                <Loader2 size={24} className="animate-spin" />
                <span>AI 识别中…</span>
              </div>
            )}
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center">
            将药盒正面置于取景框内，保持光线充足
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'order') {
    return (
      <div className="pb-4">
        <PageHeader title="从美团订单导入" onBack={() => setMode('choose')} />
        <div className="px-4 pt-4">
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-3 text-sm text-brand-700 flex items-center gap-2">
            <Sparkles size={16} /> 从您的美团买药订单中一键导入，无需手动录入
          </div>
          <div className="mt-3 space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl shadow-card p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{o.shopName}</div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{o.orderAt.slice(5, 10)}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cx('w-10 h-10 rounded-xl flex items-center justify-center text-xl', it.iconColor)}>
                        {it.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{it.name}</div>
                        <div className="text-xs text-gray-400">{it.spec} × {it.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">合计 ¥{o.totalPrice.toFixed(2)}</div>
                  <button
                    disabled={o.imported}
                    onClick={() => startOrderImport(o.id)}
                    className={cx(
                      'text-sm px-3 py-1.5 rounded-full',
                      o.imported
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-brand-600 text-white active:scale-95',
                    )}
                  >
                    {o.imported ? '已导入' : '一键导入'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'manual') {
    return (
      <div className="pb-4">
        <PageHeader title="手动添加药品" onBack={() => setMode('choose')} />
        <div className="px-4 pt-4 space-y-3">
          <FormRow label="药品名称*">
            <input
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="如：硝苯地平控释片"
              className="w-full bg-white rounded-xl px-3 py-2.5 text-sm outline-none border border-gray-100 focus:border-brand-400"
            />
          </FormRow>
          <FormRow label="规格">
            <input
              placeholder="如：30mg × 7片/盒"
              className="w-full bg-white rounded-xl px-3 py-2.5 text-sm outline-none border border-gray-100 focus:border-brand-400"
            />
          </FormRow>
          <FormRow label="用法">
            <input
              placeholder="如：每日一次，每次 1 片"
              className="w-full bg-white rounded-xl px-3 py-2.5 text-sm outline-none border border-gray-100 focus:border-brand-400"
            />
          </FormRow>
          <button
            onClick={startManual}
            className="w-full bg-brand-600 text-white rounded-2xl py-3 text-sm font-medium active:scale-95 mt-2"
          >
            下一步：设置提醒
          </button>
        </div>
      </div>
    )
  }

  // choose
  return (
    <div className="pb-4">
      <PageHeader title="添加药品" />
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-brand-500 to-orange-500 text-white rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={16} /> AI 智能添加，最快 3 秒完成
          </div>
          <div className="mt-2 text-xs opacity-90 leading-relaxed">
            推荐使用"美团订单导入"—订单即计划，零录入门槛；无订单时可拍照识别药盒
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Option
            icon={<ShoppingBag size={22} />}
            title="从美团买药订单导入"
            desc={`${orders.filter((o) => !o.imported).length} 笔订单待导入 · 推荐`}
            color="bg-brand-50 text-brand-600"
            onClick={() => setMode('order')}
            badge="推荐"
          />
          <Option
            icon={<Camera size={22} />}
            title="拍药盒 · OCR 识别"
            desc="自动识别药品名、规格、用法"
            color="bg-sky-50 text-sky-600"
            onClick={startOcr}
          />
          <Option
            icon={<Keyboard size={22} />}
            title="手动输入"
            desc="兜底方式，支持药品库搜索"
            color="bg-gray-100 text-gray-600"
            onClick={() => setMode('manual')}
          />
        </div>

        <div className="mt-6 bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Pill size={16} className="text-brand-600" />
            温馨提示
          </div>
          <ul className="mt-2 text-xs text-gray-500 space-y-1 leading-relaxed">
            <li>· 添加后自动生成提醒计划，可随时调整</li>
            <li>· AI 将同步检查与已有药品的相互作用</li>
            <li>· 库存不足时，将提前 3 天智能提醒续方</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Option({
  icon,
  title,
  desc,
  color,
  onClick,
  badge,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
  onClick: () => void
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 active:scale-[0.99]"
    >
      <div className={cx('w-11 h-11 rounded-xl flex items-center justify-center', color)}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{title}</span>
          {badge && (
            <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <Plus size={16} className="text-gray-400" />
    </button>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {children}
    </div>
  )
}
