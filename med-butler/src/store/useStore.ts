import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Medicine,
  DoseSchedule,
  DoseLog,
  FamilyMember,
  Prescription,
  MedOrder,
  HealthRecord,
  DoseStatus,
} from '../types'
import {
  initialMedicines,
  initialSchedules,
  initialFamily,
  initialPrescriptions,
  recentOrders,
  initialHealthRecords,
} from '../data/mockData'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildTodayLogs(
  schedules: DoseSchedule[],
  medicines: Medicine[],
): DoseLog[] {
  return schedules
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((s) => {
      const med = medicines.find((m) => m.id === s.medicineId)!
      // 模拟：早上两次已服、中午已服、晚上19:00待服、夜里22:00待服
      let status: DoseStatus = 'pending'
      if (s.time <= '12:30') status = 'taken'
      return {
        id: `log-${s.id}-${today()}`,
        date: today(),
        time: s.time,
        medicineId: s.medicineId,
        medicineName: med?.name ?? '未知药品',
        quantity: s.quantity,
        relativeToMeal: s.relativeToMeal,
        status,
        takenAt: status === 'taken' ? new Date().toISOString() : undefined,
      }
    })
}

interface AppState {
  // 基础数据
  medicines: Medicine[]
  schedules: DoseSchedule[]
  doseLogs: DoseLog[] // 仅今日
  family: FamilyMember[]
  prescriptions: Prescription[]
  orders: MedOrder[]
  healthRecords: HealthRecord[]

  // 全局状态
  activeMemberId: string
  elderMode: boolean

  // actions
  setActiveMember: (id: string) => void
  toggleElderMode: () => void
  markDose: (logId: string, status: DoseStatus, reason?: string) => void
  addMedicine: (m: Medicine) => void
  addMedicineWithSchedule: (m: Medicine, times: string[]) => void
  removeMedicine: (id: string) => void
  importOrder: (orderId: string) => void
  addHealthRecord: (r: HealthRecord) => void
  resetAll: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      medicines: initialMedicines,
      schedules: initialSchedules,
      doseLogs: buildTodayLogs(initialSchedules, initialMedicines),
      family: initialFamily,
      prescriptions: initialPrescriptions,
      orders: recentOrders,
      healthRecords: initialHealthRecords,

      activeMemberId: 'u_self',
      elderMode: false,

      setActiveMember: (id) => set({ activeMemberId: id }),
      toggleElderMode: () => set((s) => ({ elderMode: !s.elderMode })),

      markDose: (logId, status, reason) =>
        set((s) => ({
          doseLogs: s.doseLogs.map((l) =>
            l.id === logId
              ? {
                  ...l,
                  status,
                  takenAt: status === 'taken' ? new Date().toISOString() : l.takenAt,
                  skipReason: reason,
                }
              : l,
          ),
          // 同步扣减库存
          medicines:
            status === 'taken'
              ? s.medicines.map((m) => {
                  const log = s.doseLogs.find((l) => l.id === logId)
                  if (!log || log.medicineId !== m.id) return m
                  const stock = Math.max(0, m.stock - log.quantity)
                  const stockDays = Math.max(0, m.stockDays - 1)
                  return { ...m, stock, stockDays }
                })
              : s.medicines,
        })),

      addMedicine: (m) =>
        set((s) => ({ medicines: [...s.medicines, m] })),

      addMedicineWithSchedule: (m, times) =>
        set((s) => {
          const newSchedules: DoseSchedule[] = times.map((t, idx) => ({
            id: `s-${m.id}-${idx}`,
            medicineId: m.id,
            time: t,
            relativeToMeal: 'none',
            quantity: 1,
          }))
          const allSchedules = [...s.schedules, ...newSchedules]
          const allMedicines = [...s.medicines, m]
          return {
            medicines: allMedicines,
            schedules: allSchedules,
            doseLogs: buildTodayLogs(allSchedules, allMedicines),
          }
        }),

      removeMedicine: (id) =>
        set((s) => ({
          medicines: s.medicines.filter((m) => m.id !== id),
          schedules: s.schedules.filter((sc) => sc.medicineId !== id),
          doseLogs: s.doseLogs.filter((l) => l.medicineId !== id),
        })),

      importOrder: (orderId) =>
        set((s) => {
          const order = s.orders.find((o) => o.id === orderId)
          if (!order || order.imported) return s
          return {
            orders: s.orders.map((o) => (o.id === orderId ? { ...o, imported: true } : o)),
          }
        }),

      addHealthRecord: (r) =>
        set((s) => ({ healthRecords: [r, ...s.healthRecords] })),

      resetAll: () =>
        set({
          medicines: initialMedicines,
          schedules: initialSchedules,
          doseLogs: buildTodayLogs(initialSchedules, initialMedicines),
          family: initialFamily,
          prescriptions: initialPrescriptions,
          orders: recentOrders,
          healthRecords: initialHealthRecords,
          activeMemberId: 'u_self',
          elderMode: false,
        }),
    }),
    {
      name: 'med-butler-store',
      version: 1,
    },
  ),
)

export const getTodayDate = today
