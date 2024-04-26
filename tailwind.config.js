// @ts-check
import {createPreset, presets} from "fumadocs-ui/tailwind-plugin"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./node_modules/fumadocs-ui/dist/**/*.js", "./content/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{jsx,tsx,mdx}"],
  presets: [createPreset({ preset: 'neutral' })],
  theme: {
    extend: {

    }
  }
};
