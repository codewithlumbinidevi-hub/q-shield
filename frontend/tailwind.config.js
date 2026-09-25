/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cyber: {
          dark: '#030712',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4',
          highlight: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
