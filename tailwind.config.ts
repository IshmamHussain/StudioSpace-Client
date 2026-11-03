import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        studio: {
          50: "#faf8f5",   // Warm Cream Linen
          100: "#f4efe6",  // Soft Cream Oatmeal
          200: "#e9e2d5",  // Cream Border / Accent
          300: "#dcd3c3",  // Warm Sand
          400: "#a89f91",  // Warm Graphite Muted
          500: "#7d7365",  // Medium Roasted Taupe
          600: "#5c5347",  // Deep Studio Taupe
          700: "#3d352b",  // Warm Roasted Walnut
          800: "#27221c",  // Coffee Card Surface
          900: "#1c1814",  // Deep Roast Espresso
          950: "#13110f",  // Dark Coffee & Graphite Base
          surface: "var(--surface)",
          card: "var(--card-bg)",
          border: "var(--card-border)",
        },
        amber: {
          spotlight: "#F59E0B",
          glow: "#D97706",
          dark: "#B45309",
        },
        cinema: {
          red: "#E11D48",
          scarlet: "#FB7185",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "Syne", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(245, 158, 11, 0.25)",
        "glow-red": "0 0 25px -5px rgba(225, 29, 72, 0.3)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

