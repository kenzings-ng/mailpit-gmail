/** @type {import('tailwindcss').Config} */
export default {
  // .light opts a subtree out of dark mode (mail body stays light, like Gmail).
  darkMode: ['variant', '&:is(.dark *):not(.light *)'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
