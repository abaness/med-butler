import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  title: string
  right?: ReactNode
  onBack?: () => void
  transparent?: boolean
}

export default function PageHeader({ title, right, onBack, transparent }: Props) {
  const nav = useNavigate()
  return (
    <div
      className={
        transparent
          ? 'px-4 pt-3 pb-2 flex items-center justify-between'
          : 'px-4 pt-3 pb-3 flex items-center justify-between bg-white sticky top-0 z-20 border-b border-gray-100'
      }
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => (onBack ? onBack() : nav(-1))}
          className="-ml-1 p-1 rounded-full hover:bg-gray-100 active:scale-95 transition"
          aria-label="返回"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-semibold truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  )
}
