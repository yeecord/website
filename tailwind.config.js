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
      sans: [
        "var(--font-noto)",
        "PingFang TC",
        "Heiti TC",
        "微軟正黑體",
        ...defaultTheme.fontFamily.sans,
      ],
      ms: [
        "var(--font-noto)",
        "PingFang TC",
        "Heiti TC",
        "Microsoft YaHei",
        "微軟正黑體",
        ...defaultTheme.fontFamily.sans,
      ],
    },
    extend: {
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
