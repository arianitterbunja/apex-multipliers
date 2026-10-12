/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        background: '#150d24',
        card: '#1f1638',
        border: 'rgba(255, 255, 255, 0.1)',
        'neon-blue': '#4deeea',
        'neon-violet': '#b967ff',
      }
    },
  },
  plugins: [],
}
