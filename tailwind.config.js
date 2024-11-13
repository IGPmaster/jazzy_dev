/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#EFF1E0',
        secondary: '#141042',
        primary_bg: '#141042',
        secondary_bg: '#EFF1E0',
        tertiary_dark: '#1A0A41',
        'jazzy-blue': '#141042',
        'jazzy-darkblue': '#141042',
        'jazzy-liteblue': '#211C5A',
        'jazzy-beige': '#EFF1E0',
        'jazzy-yellow': '#FEB708',
        'jazzy-gray': '#5E5E5E',
        'jazzy-red': '#DD0524',
        'jazzy-green': '#748F1B',
        'jazzy-red-secondary': '#FC0035',
      }
    },
  },
  plugins: [],
}