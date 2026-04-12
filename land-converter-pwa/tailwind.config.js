/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-blue': '#E3F2FD',
        'legal-text': '#1976D2',
        'trad-yellow': '#FFF9C4',
        'trad-text': '#F57F17',
        'patwari-green': '#2E7D32',
        'patwari-light': '#E8F5E9',
      }
    },
  },
  plugins: [],
}
