/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'whiteBackground': '#F1F1F1',
      'black':"#000000",
      'purple':"#B7BBDC"
    }
  },
  plugins: [],
}
