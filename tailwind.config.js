/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0da6f2",
        "background-dark": "#101c22",
        "surface-dark": "#1a2a33",
        "border-dark": "#2d3e4d",
        "signal-active": "#00ff00",
        "signal-error": "#ff0000",
        "warning-orange": "#ffa500",
        "accent-purple": "#a855f7",
      },
    },
  },
  plugins: [],
}
