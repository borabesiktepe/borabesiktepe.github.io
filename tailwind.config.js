/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/components/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Roboto Mono", ...defaultTheme.fontFamily.sans]
    },
    extend: {
      colors: {
        primary: {
          text: "#ccc",
          border: "#292929",
          background: "#1a1a1a",
          orange: "#ff7a2d",
        },
      }
    },
  },
  plugins: [],
}