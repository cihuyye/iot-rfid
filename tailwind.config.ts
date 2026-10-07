import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "#F8FAFC",
        line: "#E2E8F0",
        sky: {
          DEFAULT: "#38BDF8",
          deep: "#0284C7",
        },
        ice: "#E0F2FE",
        mint: "#CCFBF1",
        amberSoft: "#FEF3C7",
        amberText: "#B45309",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.25)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
