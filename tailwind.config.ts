import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#f7f3ec",
        ink: "#2b2620",
        walnut: {
          DEFAULT: "#6b4a2f",
          dark: "#4a331f",
          light: "#8a6a4b",
        },
        brass: "#b08d4f",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "'Times New Roman'", "serif"],
        body: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        shelf: "0 10px 24px -12px rgba(43, 38, 32, 0.45)",
        spine: "inset -2px 0 3px rgba(0,0,0,0.25), inset 2px 0 2px rgba(255,255,255,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
