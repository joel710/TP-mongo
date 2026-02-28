/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'univ-green': '#10b981',
        'univ-green-dark': '#065f46',
        'univ-green-light': '#ecfdf5',
        'univ-white': '#ffffff',
      }
    },
  },
  plugins: [],
}
