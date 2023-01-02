const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./theme.config.tsx",
  ],
  theme: {
    fontFamily: {
      apple: ["Inter", "-apple-system", "sans-serif"],
    },
    extend: {
      colors: {
        secondary: {
          light: "#4A5568",
          dark: "#A0AEC0",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities }) {
      matchUtilities({
        "mask-image": (value) => ({
          maskImage: value,
        }),
      });
    }),
  ],
  darkMode: "class",
};
