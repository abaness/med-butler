import type {
  Medicine,
  DoseSchedule,
  FamilyMember,
  Prescription,
  MedOrder,
  HealthRecord,
} from '../types'

export const initialMedicines: Medicine[] = [
  {
    id: 'm1',
    name: '缬沙坦胶囊',
    brandName: '代文',
    spec: '80mg × 7粒/盒',
    form: '胶囊',
    color: '黄色',
    appearance: '黄色胶囊',
    indication: '原发性高血压',
    usage: '每日一次，每次 1 粒，饭前 30 分钟服用',
    precautions: ['服药期间监测血压', '避免同时服用保钾利尿剂', '忌突然停药'],
    interactions: ['与利尿剂合用可能引起低血压'],
    stock: 6,
    stockDays: 6,
    expiry: '2027-03-15',
    addedFrom: 'order',
    iconColor: 'bg-amber-100',
    emoji: '💛',
  },
  {
    id: 'm2',
    name: '盐酸二甲双胍片',
    brandName: '格华止',
    spec: '500mg × 20片/盒',
    form: '片剂',
    color: '白色',
    appearance: '白色圆形薄膜衣片',
    indication: '2 型糖尿病',
    usage: '每日两次，早晚餐后各 1 片',
    precautions: ['胃肠道反应常见，随餐服用可减轻', '定期监测肾功能', '造影检查前停药 48 小时'],
    interactions: ['与磺脲类同用注意低血糖'],
    stock: 14,
    stockDays: 7,
    expiry: '2027-06-20',
    addedFrom: 'order',
    iconColor: 'bg-sky-100',
    emoji: '🤍',
  },
  {
    id: 'm3',
    name: '阿司匹林肠溶片',
    brandName: '拜阿司匹灵',
    spec: '100mg × 30片/盒',
    form: '片剂',
    color: '白色',
    appearance: '白色肠溶片',
    indication: '心血管一级预防',
    usage: '每日一次，每次 1 片，饭后服用',
    precautions: ['胃部不适及时就医', '手术前 7 天停药（遵医嘱）', '监测出血倾向'],
    interactions: ['与华法林合用增加出血风险'],
    stock: 20,
    stockDays: 20,
    expiry: '2027-09-10',
    addedFrom: 'manual',
    iconColor: 'bg-slate-100',
    emoji: '⚪',
  },
  {
    id: 'm4',
    name: '辛伐他汀片',
    brandName: '舒降之',
    spec: '20mg × 7片/盒',
    form: '片剂',
    color: '粉色',
    appearance: '粉色薄膜衣片',
    indication: '高胆固醇血症',
    usage: '每晚一次，每次 1 片，睡前服用',
    precautions: ['避免食用西柚汁', '出现肌痛及时就医', '定期监测肝功能'],
    interactions: ['与红霉素合用增加横纹肌溶解风险'],
    stock: 3,
    stockDays: 3,
    expiry: '2027-02-05',
    addedFrom: 'order',
    iconColor: 'bg-pink-100',
    emoji: '💗',
  },
]

export const initialSchedules: DoseSchedule[] = [
  { id: 's1', medicineId: 'm1', time: '08:00', relativeToMeal: 'before', quantity: 1 },
  { id: 's2', medicineId: 'm2', time: '08:30', relativeToMeal: 'after', quantity: 1 },
  { id: 's3', medicineId: 'm3', time: '12:30', relativeToMeal: 'after', quantity: 1 },
  { id: 's4', medicineId: 'm2', time: '19:00', relativeToMeal: 'after', quantity: 1 },
  { id: 's5', medicineId: 'm4', time: '22:00', relativeToMeal: 'none', quantity: 1 },
]

export const initialFamily: FamilyMember[] = [
  {
    id: 'u_self',
    name: '李先生（本人）',
    relation: '本人',
    avatar: '👨‍💼',
    age: 42,
    diseases: ['高血压', '高血脂'],
    adherence: 92,
    medicineCount: 3,
    role: 'self',
  },
  {
    id: 'u_mom',
    name: '王阿姨',
    relation: '妈妈',
    avatar: '👵',
    age: 68,
    diseases: ['糖尿病', '高血压'],
    adherence: 85,
    medicineCount: 5,
    role: 'elder',
  },
  {
    id: 'u_dad',
    name: '李伯伯',
    relation: '爸爸',
    avatar: '👴',
    age: 71,
    diseases: ['冠心病', '高血压'],
    adherence: 78,
    medicineCount: 4,
    role: 'elder',
  },
]

export const initialPrescriptions: Prescription[] = [
  {
    id: 'p1',
    doctor: '张建华 主任医师',
    hospital: '美团互联网医院 · 心血管内科',
    issuedAt: '2026-03-10',
    expireAt: '2026-06-10',
    diagnosis: '原发性高血压（2 级）',
    medicines: [
      { name: '缬沙坦胶囊', spec: '80mg', usage: '每日一次，每次 1 粒' },
      { name: '阿司匹林肠溶片', spec: '100mg', usage: '每日一次，每次 1 片' },
    ],
  },
  {
    id: 'p2',
    doctor: '陈丽娟 副主任医师',
    hospital: '美团互联网医院 · 内分泌科',
    issuedAt: '2026-04-01',
    expireAt: '2026-07-01',
    diagnosis: '2 型糖尿病',
    medicines: [{ name: '盐酸二甲双胍片', spec: '500mg', usage: '每日两次，早晚餐后各 1 片' }],
  },
]

export const recentOrders: MedOrder[] = [
  {
    id: 'o1',
    shopName: '美团买药 · 康佳大药房（朝阳门店）',
    orderAt: '2026-04-20 18:32',
    items: [
      { name: '缬沙坦胶囊 80mg', spec: '14粒装', quantity: 2, emoji: '💛', iconColor: 'bg-amber-100' },
      { name: '辛伐他汀片 20mg', spec: '7片装', quantity: 1, emoji: '💗', iconColor: 'bg-pink-100' },
    ],
    totalPrice: 128.5,
    imported: false,
  },
  {
    id: 'o2',
    shopName: '美团买药 · 老百姓大药房（国贸店）',
    orderAt: '2026-04-12 10:15',
    items: [
      { name: '盐酸二甲双胍片 500mg', spec: '20片装', quantity: 2, emoji: '🤍', iconColor: 'bg-sky-100' },
    ],
    totalPrice: 46.0,
    imported: false,
  },
]

export const initialHealthRecords: HealthRecord[] = [
  { id: 'h1', type: 'bp', date: '2026-04-23', value: '128/82', note: '晨起' },
  { id: 'h2', type: 'bp', date: '2026-04-22', value: '135/88', note: '晚' },
  { id: 'h3', type: 'bp', date: '2026-04-21', value: '130/84' },
  { id: 'h4', type: 'bg', date: '2026-04-23', value: '6.8', note: '空腹' },
  { id: 'h5', type: 'bg', date: '2026-04-22', value: '7.2', note: '空腹' },
]

// 预置本周依从性（7 天）
export const weeklyAdherence = [
  { day: '周一', value: 100 },
  { day: '周二', value: 100 },
  { day: '周三', value: 75 },
  { day: '周四', value: 100 },
  { day: '周五', value: 100 },
  { day: '周六', value: 75 },
  { day: '今日', value: 75 },
]

// AI 管家预设对话
export const butlerQuickReplies = [
  '我漏吃了一次药怎么办？',
  '我想续方买药',
  '这些药能一起吃吗？',
  '我最近血压有点高',
  '我要出差 3 天',
]
