import PageHeader from '../components/PageHeader'
import { Video, MessageSquareText, Phone, Star, ChevronRight, Clock } from 'lucide-react'

interface Doctor {
  name: string
  title: string
  hospital: string
  dept: string
  rate: number
  cases: number
  price: number
  online: boolean
  avatar: string
}

const doctors: Doctor[] = [
  {
    name: '张建华',
    title: '主任医师',
    hospital: '北京协和医院',
    dept: '心血管内科',
    rate: 4.9,
    cases: 1860,
    price: 89,
    online: true,
    avatar: '👨‍⚕️',
  },
  {
    name: '陈丽娟',
    title: '副主任医师',
    hospital: '北京安贞医院',
    dept: '内分泌科 · 糖尿病',
    rate: 4.8,
    cases: 1204,
    price: 69,
    online: true,
    avatar: '👩‍⚕️',
  },
  {
    name: '刘伟民',
    title: '主治医师',
    hospital: '北京朝阳医院',
    dept: '全科医学 · 慢病管理',
    rate: 4.7,
    cases: 820,
    price: 45,
    online: false,
    avatar: '👨‍⚕️',
  },
]

export default function Consultation() {
  return (
    <div className="pb-4">
      <PageHeader title="在线问诊" />
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <Channel icon={<MessageSquareText size={22} />} label="图文问诊" desc="平均 5 分钟响应" color="bg-sky-50 text-sky-600" />
          <Channel icon={<Phone size={22} />} label="电话问诊" desc="30 分钟专属通话" color="bg-emerald-50 text-emerald-600" />
          <Channel icon={<Video size={22} />} label="视频问诊" desc="医生面对面" color="bg-violet-50 text-violet-600" />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">慢病专家推荐</h2>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              基于您的病情匹配 <ChevronRight size={14} />
            </span>
          </div>
          <div className="space-y-3">
            {doctors.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-3 flex gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-orange-100 flex items-center justify-center text-2xl">
                    {d.avatar}
                  </div>
                  {d.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{d.name}</span>
                    <span className="text-xs text-gray-500">{d.title}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {d.hospital} · {d.dept}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Star size={12} fill="currentColor" /> {d.rate}
                    </span>
                    <span>问诊 {d.cases}+</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="text-brand-600 font-semibold text-sm">¥{d.price}</div>
                  <button className="bg-brand-600 text-white text-xs px-3 py-1.5 rounded-full active:scale-95">
                    问诊
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
            <Clock size={16} /> 预约复诊
          </div>
          <div className="mt-2 text-xs text-gray-600 leading-relaxed">
            根据您上次就诊时间（2026-03-10），建议 2026-06-08 前复诊。系统将提前 7 天提醒您。
          </div>
          <button className="mt-3 w-full bg-white border border-sky-200 text-sky-700 rounded-xl py-2 text-sm">
            立即预约复诊时段
          </button>
        </div>
      </div>
    </div>
  )
}

function Channel({
  icon,
  label,
  desc,
  color,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  color: string
}) {
  return (
    <button className="bg-white rounded-2xl shadow-card py-3 flex flex-col items-center gap-1 active:scale-95">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="text-sm font-medium mt-1">{label}</div>
      <div className="text-[10px] text-gray-400">{desc}</div>
    </button>
  )
}
