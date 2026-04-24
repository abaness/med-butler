// 药品
export interface Medicine {
  id: string
  name: string // 通用名
  brandName?: string // 商品名
  spec: string // 规格，如 80mg × 14 粒
  form: string // 剂型：片剂/胶囊/注射液...
  color?: string // 外观提示色
  appearance?: string // 外观描述
  indication: string // 适应症
  usage: string // 用法用量（自然语言）
  precautions: string[] // 注意事项
  interactions?: string[] // 相互作用提示
  stock: number // 剩余粒数
  stockDays: number // 剩余天数
  expiry: string // 效期 YYYY-MM-DD
  addedFrom: 'order' | 'ocr' | 'manual'
  iconColor: string // 图标背景色 (tailwind)
  emoji: string // 图标 emoji
}

// 用药计划条目（某个药的某次服用安排）
export interface DoseSchedule {
  id: string
  medicineId: string
  time: string // HH:mm
  relativeToMeal: 'before' | 'after' | 'none'
  quantity: number // 单次剂量
  note?: string
}

// 某天某次服药记录
export type DoseStatus = 'pending' | 'taken' | 'skipped' | 'snoozed'

export interface DoseLog {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  medicineId: string
  medicineName: string
  quantity: number
  relativeToMeal: 'before' | 'after' | 'none'
  status: DoseStatus
  takenAt?: string // ISO
  skipReason?: string
}

// 家庭成员
export interface FamilyMember {
  id: string
  name: string
  relation: string
  avatar: string // emoji
  age: number
  diseases: string[]
  adherence: number // 本周依从性 0-100
  medicineCount: number
  role: 'self' | 'elder' | 'other'
}

// 电子处方
export interface Prescription {
  id: string
  doctor: string
  hospital: string
  issuedAt: string // YYYY-MM-DD
  expireAt: string
  medicines: { name: string; spec: string; usage: string }[]
  diagnosis: string
}

// AI 对话消息
export interface ChatMessage {
  id: string
  role: 'user' | 'butler'
  content: string
  time: string
  quickReplies?: string[]
  card?: {
    type: 'refill' | 'interaction' | 'reminder'
    title: string
    desc: string
    action: string
    link?: string
  }
}

// 美团买药历史订单（用于一键导入）
export interface MedOrder {
  id: string
  shopName: string
  orderAt: string
  items: { name: string; spec: string; quantity: number; emoji: string; iconColor: string }[]
  totalPrice: number
  imported: boolean
}

// 健康记录（血压 / 血糖）
export interface HealthRecord {
  id: string
  type: 'bp' | 'bg' // blood pressure / blood glucose
  date: string // YYYY-MM-DD
  value: string // "128/82" or "6.8"
  note?: string
}
