import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sistema de color industrial/automotriz
        surface: {
          0: "#0a0a0b",
          1: "#111113",
          2: "#18181b",
          3: "#1f1f23",
          4: "#27272c",
        },
        border: {
          DEFAULT: "#2e2e34",
          subtle: "#222226",
          strong: "#3f3f47",
        },
        text: {
          primary: "#e8e8ed",
          secondary: "#9898a6",
          muted: "#5a5a68",
        },
        accent: {
          DEFAULT: "#f97316",
          hover: "#ea6c0a",
          subtle: "#7c3a18",
          muted: "#2d1506",
        },
        success: {
          DEFAULT: "#22c55e",
          subtle: "#14532d",
        },
        danger: {
          DEFAULT: "#ef4444",
          subtle: "#450a0a",
        },
        warning: {
          DEFAULT: "#eab308",
          subtle: "#422006",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Bebas Neue'", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
