/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0b0f19',
          surface: '#111827',
          card: 'rgba(31, 41, 55, 0.7)',
          input: '#1a2234'
        },
        brand: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
