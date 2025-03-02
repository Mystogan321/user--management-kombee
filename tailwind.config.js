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
          DEFAULT: '#0F7490',
          light: '#1A8CAB',
          dark: '#0A5A70',
        },
        secondary: {
          DEFAULT: '#6B21A8',
          light: '#7E3BBD',
          dark: '#581C8A',
        },
        background: {
          DEFAULT: '#F0F4F5',
          dark: '#E0E7E9',
        },
      },
    },
  },
  plugins: [],
}