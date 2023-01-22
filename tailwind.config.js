const plugin = require("tailwindcss/plugin");

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
            sans: [
                // "var(--font-noto)",
                "-apple-system",
                "Microsoft JhengHei UI",
                "sans-serif",
            ],
            sansHeading: [
                "var(--font-noto-heading)",
                "-apple-system",
                "Microsoft JhengHei UI",
                "sans-serif",
            ],
            sansMedium: [
                "var(--font-noto)",
                "-apple-system",
                "Microsoft JhengHei UI",
                "sans-serif",
            ]
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
