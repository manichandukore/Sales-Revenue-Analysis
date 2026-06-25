/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          400: '#6b8eff',
          500: '#4a6cf7',
          600: '#3451d1',
          700: '#2440b3',
          900: '#0d1b6b',
        },
        surface: {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#151e38',
          600: '#1c2847',
          500: '#243054',
        },
        accent: {
          cyan: '#00d4ff',
          green: '#00f5a0',
          amber: '#ffb347',
          pink: '#ff6b9d',
          purple: '#a855f7',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(74,108,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,108,247,0.03) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
