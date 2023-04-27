const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./theme.config.tsx",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-noto)", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      fontFamily: {
        yahei: ["Microsoft YaHei", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "#0a0c10",
        secondary: {
          light: "#4A5568",
          dark: "#A0AEC0",
        },
      },
    },
  },
  darkMode: "class",
};
