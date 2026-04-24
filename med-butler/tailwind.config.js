/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ec',
          100: '#ffe8cc',
          200: '#ffd199',
          300: '#ffb866',
          400: '#ff9e3d',
          500: '#ffc300',
          600: '#ff8000', // 美团黄/橙系主色
          700: '#e66b00',
          800: '#a84e00',
          900: '#6b3200',
        },
        meds: {
          health: '#10b981',
          warn: '#f59e0b',
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
