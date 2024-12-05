/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#007bff',
        'custom-gray': '#6c757d',
      },
      fontSize: {
        'base': '15px',
      },
    },
  },
  plugins: [],
}