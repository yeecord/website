const plugin = require("tailwindcss/plugin");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./layout/**/*.{js,ts,jsx,tsx}",
        "./theme.config.tsx",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ["var(--font-noto)", ...fontFamily.sans],
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
