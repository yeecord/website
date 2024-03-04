import {createPreset} from "fumadocs-ui/tailwind-plugin"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./node_modules/fumadocs-ui/dist/**/*.js", "./content/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{jsx,tsx,mdx}"],
  presets: [createPreset()],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
};
