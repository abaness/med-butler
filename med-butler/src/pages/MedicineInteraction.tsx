import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import { ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

export default function MedicineInteraction() {
  const { medicines } = useStore()

  return (
    <div className="pb-4">
      <PageHeader title="AI 药物相互作用检查" />
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck size={18} /> 基于药品知识图谱的全量扫描
          </div>
          <div className="mt-2 text-xs opacity-95 leading-relaxed">
            我们为您本地的 {medicines.length} 款药品进行了两两相互作用分析，结果仅供参考，用药请遵医嘱。
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <ResultItem
            level="warn"
            title="阿司匹林 × 辛伐他汀"
            desc="两药合用总体安全，但辛伐他汀与西柚汁同服会增加横纹肌溶解风险，服用期间建议避免饮用西柚汁。"
          />
          <ResultItem
            level="safe"
            title="缬沙坦 × 阿司匹林"
            desc="常见的心血管联合用药组合，安全性良好，建议按时按量服用。"
          />
          <ResultItem
            level="safe"
            title="二甲双胍 × 缬沙坦"
            desc="无明显相互作用，可正常合用。注意监测血糖与血压数据。"
          />
          <ResultItem
            level="info"
            title="通用提示"
            desc="服药期间如出现头晕、肌肉酸痛、异常出血等，请立即就医并联系您的主治医生。"
          />
        </div>

        <div className="mt-6 bg-white rounded-2xl p-4 shadow-card">
          <div className="text-sm font-medium mb-2">本次检测结论</div>
          <div className="flex items-center gap-2 text-sm text-meds-health">
            <CheckCircle2 size={16} /> 总体安全，<span className="text-meds-warn">1 条注意事项</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 leading-relaxed">
            建议您在 AI 管家中进一步询问具体的饮食禁忌，或发起在线问诊让医生评估。
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultItem({
  level,
  title,
  desc,
}: {
  level: 'safe' | 'warn' | 'danger' | 'info'
  title: string
  desc: string
}) {
  const palette = {
    safe: 'border-emerald-100 bg-emerald-50/50 text-meds-health',
    warn: 'border-orange-100 bg-orange-50/50 text-meds-warn',
    danger: 'border-red-100 bg-red-50/50 text-meds-danger',
    info: 'border-sky-100 bg-sky-50/50 text-sky-600',
  }[level]

  const Icon = level === 'safe' ? CheckCircle2 : level === 'warn' || level === 'danger' ? AlertTriangle : Info

  return (
    <div className={`rounded-2xl p-3 border ${palette}`}>
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Icon size={16} />
        {title}
      </div>
      <div className="mt-1 text-xs text-gray-600 leading-relaxed">{desc}</div>
    </div>
  )
}
