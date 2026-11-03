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
          50: "#faf6ee",   // Rich Warm Clotted Cream Surface
          100: "#efe8dc",  // Distinct Warm Cream Oatmeal Canvas
          200: "#e3d7c4",  // Warm Cream Border & Accent
          300: "#d3c4ad",  // Toasted Cream Sand
          400: "#9c8e7c",  // Warm Graphite Taupe Muted
          500: "#756756",  // Roasted Coffee Taupe
          600: "#55493c",  // Deep Studio Coffee
          700: "#3a3026",  // Warm Roasted Bean
          800: "#241d17",  // Coffee Bean Card Surface
          900: "#1c1714",  // Deep Roast Espresso & Graphite
          950: "#120e0c",  // Dark Coffee & Graphite Base
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

