/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#0B0F19',
          card: '#121826',
          surface: '#1A2333',
          border: '#2A364F',
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          xp: '#06B6D4',
          'xp-light': '#67E8F9',
          strength: '#EF4444',
          intellect: '#3B82F6',
          discipline: '#8B5CF6',
          vitality: '#10B981',
          charisma: '#EC4899',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.5)',
        'glow-xp': '0 0 20px -5px rgba(6, 182, 212, 0.5)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.5)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
