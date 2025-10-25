/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        giaza: ["Giaza", "sans-serif"], // your local font
        bebas: ["Bebas", "sans-serif"],
      },
    },
  },
  plugins: [],
};
