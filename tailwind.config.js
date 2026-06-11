/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffedd5',
          200: '#ffd8a8',
          300: '#ffbc6b',
          400: '#ff9d33',
          500: '#f97d1c',
          600: '#e8620a',
          700: '#c04a0c',
          800: '#983b12',
          900: '#7a3312',
        },
        warm: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
        }
      }
    },
  },
  plugins: [],
}
