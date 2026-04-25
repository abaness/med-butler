/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 全产品统一美团黄系（不再使用橙色作为品牌色）
        brand: {
          50: '#FFFCEA',   // 浅米黄 · 卡片浅底
          100: '#FFF6CC',
          200: '#FFEB99',
          300: '#FFDF66',
          400: '#FFD333',
          500: '#FFD200',  // 美团亮黄 · Hero 主色
          600: '#FFC500',  // 按钮主黄 · 主操作色
          700: '#A16207',  // 深金棕 · 文字/图标在白底上的可读色
          800: '#854D0E',
          900: '#713F12',
        },
        meds: {
          health: '#10b981',
          warn: '#f59e0b',   // 橙色保留为"警告语义色"（库存/漏服）
          danger: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '500',      // 默认 normal 提升到 Medium
        medium: '600',      // medium 提升到 Semibold
        semibold: '700',    // semibold 提升到 Bold
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(17, 24, 39, 0.06)',
        pop: '0 12px 40px -8px rgba(17, 24, 39, 0.18)',
      },
    },
  },
  plugins: [],
}
