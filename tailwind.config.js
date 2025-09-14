
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: .7, transform: 'scale(1.05)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
