const { extend } = require("dayjs");
const { theme, plugins } = require("./tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      lineClamp: {
        3: "3",
      },
    },
  },
  variants: {
    lineClamp: ["responsive"],
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
