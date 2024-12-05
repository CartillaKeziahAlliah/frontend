/** @type {import('tailwindcss').Config} */
export default {
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
