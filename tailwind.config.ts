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
        parchment: "#f4efe6",
        ivory: "#f7f3ec",
        ink: "#2a241c",
        chocolate: {
          DEFAULT: "#2c2118",
          deep: "#1f1712",
          soft: "#3a2d22",
        },
        honey: {
          DEFAULT: "#a67c52",
          light: "#c4a074",
          dark: "#7a5a3a",
        },
        walnut: {
          DEFAULT: "#6b4a2f",
          dark: "#4a331f",
          light: "#8a6a4b",
        },
        sage: {
          DEFAULT: "#7d8f6a",
          soft: "#a3b18a",
          muted: "#e8ede0",
        },
        brass: "#b08d4f",
        terracotta: "#c47a5a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        shelf: "0 14px 36px -16px rgba(42, 36, 28, 0.45)",
        ledge: "0 6px 14px -6px rgba(42, 36, 28, 0.35)",
        spine:
          "inset -2px 0 4px rgba(0,0,0,0.28), inset 2px 0 3px rgba(255,255,255,0.18), 1px 2px 4px rgba(0,0,0,0.18)",
        soft: "0 1px 2px rgba(42, 36, 28, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
