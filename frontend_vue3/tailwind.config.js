// tailwind.config.js
// 下面已经有了 JSDoc 注释，会有自动提示了

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      padding: {},
      margin: {},
      width: {},
      height: {},
    },
  },
  plugins: [],
}