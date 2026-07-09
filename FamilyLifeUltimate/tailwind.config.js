/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#bdbaf3ff',
        background: '#f9fafb',
        surface: '#ffffff',
      },
      text: {
        DEFAULT: '#0f172a',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
}
