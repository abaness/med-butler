import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, Mic, Pill, ShoppingBag, Stethoscope } from 'lucide-react'
import { butlerQuickReplies } from '../data/mockData'
import { cx } from '../utils'

interface Msg {
  id: string
  role: 'user' | 'butler'
  content: string
  quickReplies?: string[]
  card?: {
    type: 'refill' | 'consult' | 'interaction'
    title: string
    desc: string
    action: string
    to: string
  }
}

const initialMessages: Msg[] = [
  {
    id: '1',
    role: 'butler',
    content:
      '您好，我是您的专属慢病用药小管家 💊。我可以帮您记录用药、提醒服药、判断药物相互作用、协助续方等。您今天想咨询什么？',
    quickReplies: butlerQuickReplies,
  },
]

export default function Chat() {
  const nav = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>(initialMessages)
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = buildReply(trimmed)
      setMessages((m) => [...m, reply])
      setTyping(false)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col max-w-[440px] mx-auto">
      {/* 顶部 */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-3 py-3 flex items-center gap-2">
        <button onClick={() => nav(-1)} className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 text-gray-900 flex items-center justify-center">
          <Sparkles size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">AI 用药管家</div>
          <div className="text-[11px] text-meds-health flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 在线 · 基于医药专业大模型
          </div>
        </div>
      </div>

      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 pb-40 space-y-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} onQuick={send} onCardAction={(to) => nav(to)} />
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 text-gray-900 flex items-center justify-center shrink-0">
              <Sparkles size={14} />
            </div>
            <div className="bg-white shadow-card rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* 输入栏 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-100 px-3 py-2.5">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
          <Mic size={18} className="text-gray-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="问点什么，比如：漏吃一次怎么办？"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={() => send(input)}
            className={cx(
              'w-8 h-8 rounded-full flex items-center justify-center',
              input.trim() ? 'bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900' : 'bg-gray-200 text-gray-400',
            )}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-1.5 text-[10px] text-gray-400 text-center">
          AI 建议仅供参考，医疗决策请咨询执业医师
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  msg,
  onQuick,
  onCardAction,
}: {
  msg: Msg
  onQuick: (t: string) => void
  onCardAction: (to: string) => void
}) {
  const isUser = msg.role === 'user'
  return (
    <div className={cx('flex items-end gap-2 fade-in-up', isUser && 'flex-row-reverse')}>
      <div
        className={cx(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isUser
            ? 'bg-brand-100 text-brand-600'
            : 'bg-gradient-to-br from-brand-400 to-brand-500 text-gray-900',
        )}
      >
        {isUser ? '我' : <Sparkles size={14} />}
      </div>
      <div className={cx('max-w-[78%]', isUser && 'items-end')}>
        <div
          className={cx(
            'px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap',
            isUser
              ? 'bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 rounded-2xl rounded-br-sm'
              : 'bg-white shadow-card rounded-2xl rounded-tl-sm',
          )}
        >
          {msg.content}
        </div>
        {msg.card && (
          <div
            onClick={() => onCardAction(msg.card!.to)}
            className="mt-2 bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-3 cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
              {msg.card.type === 'refill' && <Pill size={16} />}
              {msg.card.type === 'consult' && <Stethoscope size={16} />}
              {msg.card.type === 'interaction' && <Sparkles size={16} />}
              {msg.card.title}
            </div>
            <div className="mt-1 text-xs text-gray-600 leading-relaxed">{msg.card.desc}</div>
            <div className="mt-2 text-right">
              <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 font-semibold px-3 py-1.5 rounded-full">
                <ShoppingBag size={12} /> {msg.card.action}
              </span>
            </div>
          </div>
        )}
        {msg.quickReplies && (
          <div className="mt-2 flex flex-wrap gap-2">
            {msg.quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => onQuick(q)}
                className="text-xs bg-white text-gray-700 border border-gray-200 rounded-full px-3 py-1.5 active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function buildReply(text: string): Msg {
  const id = `b-${Date.now()}`
  const t = text.toLowerCase()

  if (text.includes('漏') || text.includes('忘')) {
    return {
      id,
      role: 'butler',
      content:
        '如果是短期遗漏（2 小时内），请立刻补服；若超过常规服药时间一半，建议跳过，下次正常服用，<b>切勿一次服双倍</b>。\n\n根据您目前的"辛伐他汀"用药计划，补服建议：22:00 前补服，22:00 后跳过。',
      quickReplies: ['帮我设置更明显的提醒', '我一会儿再吃', '继续咨询'],
    }
  }

  if (text.includes('续方') || text.includes('买药') || t.includes('补药')) {
    return {
      id,
      role: 'butler',
      content: '好的，我已为您识别到 2 款库存不足的药品，已为您生成一键续方方案，原处方仍在有效期内。',
      card: {
        type: 'refill',
        title: '一键续方 · 预计 ¥66',
        desc: '缬沙坦胶囊 × 2 盒 + 辛伐他汀 × 1 盒，骑手 28 分钟送达',
        action: '立即续方',
        to: '/services/refill',
      },
    }
  }

  if (text.includes('一起') || text.includes('冲突') || text.includes('相互')) {
    return {
      id,
      role: 'butler',
      content: '您目前的 4 种药品我已全量分析，总体安全，有 1 条注意事项：',
      card: {
        type: 'interaction',
        title: '辛伐他汀 × 西柚汁',
        desc: '服用辛伐他汀期间建议避免饮用西柚汁，以免增加横纹肌溶解风险。',
        action: '查看完整报告',
        to: '/medicine/interaction',
      },
    }
  }

  if (text.includes('血压') || text.includes('血糖')) {
    return {
      id,
      role: 'butler',
      content:
        '近 7 日您的收缩压平均 128 mmHg，控制良好。不过空腹血糖（6.8 mmol/L）略偏高，建议：\n\n1. 清淡饮食，减少精制碳水；\n2. 饭后 30 分钟散步 20 分钟；\n3. 如持续偏高，建议线上复诊调整用药。',
      card: {
        type: 'consult',
        title: '预约陈丽娟医生复诊',
        desc: '内分泌科副主任医师，今日晚间可预约视频复诊',
        action: '查看医生',
        to: '/services/consult',
      },
    }
  }

  if (text.includes('出差') || text.includes('旅行') || text.includes('出门')) {
    return {
      id,
      role: 'butler',
      content:
        '收到，请告诉我具体出行天数。我将为您：\n\n✅ 预估出行期间药量，不足则提前续方\n✅ 根据目的地时区调整提醒时间\n✅ 生成一张便携"用药清单"方便随身携带',
      quickReplies: ['3 天', '一周', '两周以上'],
    }
  }

  if (text.includes('3 天') || text.includes('3天')) {
    return {
      id,
      role: 'butler',
      content:
        '已为您计算：出行 3 天共需服药 12 次。您当前药品库存充足，无需续方。\n\n我将同步调整提醒时间为您的出差城市时区（北京 → 深圳），并在出发前一晚提醒您"记得带药"。',
      quickReplies: ['好的', '帮我打包清单'],
    }
  }

  return {
    id,
    role: 'butler',
    content:
      '明白了。我可以帮您管理用药计划、判断药物是否冲突、协助续方与预约问诊。如涉及诊断或治疗方案调整，建议联系您的主治医生。',
    quickReplies: butlerQuickReplies,
  }
}
