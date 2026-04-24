export function cx(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ')
}

export function getGreeting(name: string) {
  const h = new Date().getHours()
  if (h < 6) return `夜深了，${name}，记得按时作息`
  if (h < 11) return `早上好，${name}`
  if (h < 13) return `中午好，${name}`
  if (h < 18) return `下午好，${name}`
  return `晚上好，${name}`
}

export function formatTime(hm: string) {
  const h = Number(hm.split(':')[0])
  if (h < 12) return `上午 ${hm}`
  if (h === 12) return `中午 ${hm}`
  if (h < 18) return `下午 ${hm}`
  return `晚上 ${hm}`
}

export function mealLabel(relative: 'before' | 'after' | 'none') {
  if (relative === 'before') return '饭前'
  if (relative === 'after') return '饭后'
  return ''
}
