import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function AIButlerFab() {
  const nav = useNavigate()
  return (
    <button
      onClick={() => nav('/chat')}
      className="fixed bottom-24 right-[max(16px,calc((100%-440px)/2+16px))] z-30 bg-gradient-to-br from-brand-400 to-brand-500 text-gray-900 rounded-full shadow-pop w-14 h-14 flex items-center justify-center pulse-ring"
      aria-label="唤起 AI 管家"
    >
      <Sparkles size={24} />
    </button>
  )
}
