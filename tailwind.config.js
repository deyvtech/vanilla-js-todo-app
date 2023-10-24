/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    fontFamily: {
      "Fira-Code": ["Fira Code", "monospace"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};