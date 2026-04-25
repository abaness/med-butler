import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import { FileText, Stamp, CalendarClock, Download, QrCode } from 'lucide-react'

export default function Prescription() {
  const { prescriptions } = useStore()

  return (
    <div className="pb-4">
      <PageHeader title="我的电子处方" />
      <div className="px-4 pt-4 space-y-4">
        {prescriptions.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            <div className="bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 px-4 py-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span className="text-sm font-bold">电子处方（RP）</span>
                </div>
                <div className="text-xs text-gray-700 mt-1">{p.hospital}</div>
              </div>
              <div className="text-right text-[10px] bg-white/70 rounded-md px-2 py-1 text-gray-800 shadow-sm">
                有效至 {p.expireAt}
              </div>
            </div>

            <div className="px-4 py-3 text-sm">
              <Row label="开方医生" value={p.doctor} />
              <Row label="诊断" value={p.diagnosis} />
              <Row label="开方日期" value={p.issuedAt} />

              <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
                <div className="text-xs text-gray-500 mb-2">处方药品</div>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  {p.medicines.map((m, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-gray-500 ml-1">{m.spec}</span>
                      <div className="ml-5 text-xs text-gray-500 -mt-0.5">{m.usage}</div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <Stamp size={14} /> 医师已签名 · 医院已盖章
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <CalendarClock size={14} /> 剩余 47 天
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="bg-gray-50 rounded-xl py-2 text-sm flex items-center justify-center gap-1">
                  <Download size={14} /> 下载 PDF
                </button>
                <button className="bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 text-gray-900 font-semibold rounded-xl py-2 text-sm flex items-center justify-center gap-1 active:scale-95">
                  <QrCode size={14} /> 扫码取药
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-400 text-center py-2">
          处方由美团互联网医院签发，受医保系统认证
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-1.5 text-sm">
      <span className="text-gray-500 w-20 shrink-0">{label}</span>
      <span className="text-gray-900 text-right flex-1">{value}</span>
    </div>
  )
}
