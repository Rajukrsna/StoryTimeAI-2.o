/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', 'sans-serif'],
         keyframes: {
    'fade-in': {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    'slide-up': {
      '0%': { transform: 'translateY(40px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  },
  animation: {
    'fade-in': 'fade-in 0.6s ease-out both',
    'slide-up': 'slide-up 0.7s ease-out both',
  },
      },
    },
  },
  plugins: [],
}
