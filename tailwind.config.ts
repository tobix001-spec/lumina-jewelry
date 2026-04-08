import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        sans:    ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif:   ["Cormorant Garamond", "Georgia", "serif"],
      },
      colors: {
        cream:   { DEFAULT: "#FAF8F5", dark: "#F2EDE6" },
        gold:    { DEFAULT: "#C9A84C", light: "#E8D5A3", dark: "#9A7A2E", pale: "rgba(201,168,76,0.12)" },
        charcoal:{ DEFAULT: "#1A1714", mid: "#2D2926" },
        warm:    { gray: "#6B6560", border: "#E8E2DA", "border-dark": "#D4CCBF" },
        stone: {
          50:  "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4",
          300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c",
          600: "#57534e", 700: "#44403c", 800: "#292524",
          900: "#1c1917", 950: "#0c0a09",
        },
      },
      fontSize: {
        "2xs": ["0.625rem",  { lineHeight: "1rem" }],
        "xs":  ["0.75rem",   { lineHeight: "1.125rem" }],
        "sm":  ["0.875rem",  { lineHeight: "1.375rem" }],
        "base":["1rem",      { lineHeight: "1.625rem" }],
        "lg":  ["1.125rem",  { lineHeight: "1.75rem" }],
        "xl":  ["1.25rem",   { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",    { lineHeight: "2rem" }],
        "3xl": ["1.875rem",  { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem",   { lineHeight: "2.75rem" }],
        "5xl": ["3rem",      { lineHeight: "1.1" }],
        "6xl": ["3.75rem",   { lineHeight: "1.05" }],
        "7xl": ["4.5rem",    { lineHeight: "1" }],
        "8xl": ["6rem",      { lineHeight: "1" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
      },
      maxWidth: {
        "8xl":  "90rem",
        "9xl":  "100rem",
        "10xl": "112rem",
      },
      borderRadius: {
        "none": "0",
        "sm":   "2px",
        "DEFAULT":"4px",
        "md":   "6px",
        "lg":   "8px",
        "xl":   "12px",
        "2xl":  "16px",
        "3xl":  "24px",
        "full": "9999px",
      },
      boxShadow: {
        "luxury-sm": "0 2px 12px rgba(26,23,20,0.06)",
        "luxury":    "0 8px 32px rgba(26,23,20,0.08)",
        "luxury-lg": "0 20px 60px rgba(26,23,20,0.12)",
        "luxury-xl": "0 32px 80px rgba(26,23,20,0.16)",
        "gold":      "0 4px 20px rgba(201,168,76,0.3)",
        "gold-lg":   "0 8px 40px rgba(201,168,76,0.4)",
        "inset-border": "inset 0 0 0 1px rgba(26,23,20,0.08)",
      },
      backgroundImage: {
        "gold-gradient":   "linear-gradient(135deg, #C9A84C 0%, #E8C96E 50%, #C9A84C 100%)",
        "cream-gradient":  "linear-gradient(180deg, #FAF8F5 0%, #F2EDE6 100%)",
        "dark-gradient":   "linear-gradient(180deg, #1A1714 0%, #2D2926 100%)",
        "hero-overlay":    "linear-gradient(105deg, rgba(26,23,20,0.65) 0%, rgba(26,23,20,0.2) 60%, transparent 100%)",
        "card-overlay":    "linear-gradient(0deg, rgba(26,23,20,0.7) 0%, rgba(26,23,20,0.1) 50%, transparent 100%)",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.4, 0, 0.2, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-6px)" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0)" },
          "50%":       { boxShadow: "0 0 0 6px rgba(201,168,76,0.15)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.6s cubic-bezier(0.4,0,0.2,1) both",
        "fade-in":    "fade-in 0.4s cubic-bezier(0.4,0,0.2,1) both",
        "scale-in":   "scale-in 0.4s cubic-bezier(0.4,0,0.2,1) both",
        shimmer:      "shimmer 1.8s ease-in-out infinite",
        float:        "float 3s ease-in-out infinite",
        "gold-pulse": "gold-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
