/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "var(--bg-primary)",
      },
    },
  },
  plugins: [],
};
