/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-surface": "#322f37",
        "on-error": "#ffffff",
        "primary-container": "#dc2626", // Red-600
        "on-surface-variant": "#450a0a", // Deep Red
        "on-tertiary-fixed": "#1f1539",
        "secondary-fixed": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#30254a",
        "secondary-fixed-dim": "#ffb4ab",
        "tertiary-container": "#998cb7",
        "on-background": "#450a0a", // Darker Red
        "primary-fixed": "#fee2e2", // Red-100
        "surface-container": "#fff1f2", // Very light red/white
        "on-tertiary-fixed-variant": "#4b4167",
        "tertiary-fixed-dim": "#cebfee",
        "on-surface": "#450a0a",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "surface-container-highest": "#fecaca", // Red-200
        "surface-bright": "#ffffff",
        "on-primary-fixed-variant": "#991b1b",
        "tertiary": "#635880",
        "outline-variant": "#fca5a5",
        "on-secondary": "#ffffff",
        "primary": "#b91c1c", // Red-700
        "surface": "#ffffff",
        "on-error-container": "#93000a",
        "inverse-on-surface": "#fef2f2",
        "tertiary-fixed": "#e9ddff",
        "outline": "#ef4444",
        "on-secondary-fixed-variant": "#93000d",
        "surface-container-low": "#fff5f5",
        "inverse-primary": "#f87171",
        "on-primary-fixed": "#450a0a",
        "secondary": "#dc2626",
        "surface-container-high": "#fee2e2",
        "surface-dim": "#fecaca",
        "primary-fixed-dim": "#f87171",
        "surface-tint": "#dc2626",
        "surface-variant": "#fee2e2",
        "on-secondary-container": "#ffffff",
        "secondary-container": "#b91c1c",
        "on-primary-container": "#450a0a",
        "background": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed": "#410002"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem", 
        "lg": "2rem", 
        "xl": "3rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "full": "9999px"
      },
      boxShadow: {
        "card": "0 24px 60px rgba(69, 10, 10, 0.08)", // Red-tinted shadow
        "soft": "0 18px 38px rgba(220, 38, 38, 0.12)", // Red-tinted shadow
      },
      backgroundImage: {
        // Red-based hero glow
        "hero-glow": "radial-gradient(circle at 10% 10%, rgba(220, 38, 38, 0.08), transparent 36%), radial-gradient(circle at 85% 18%, rgba(220, 38, 38, 0.05), transparent 28%), radial-gradient(circle at 70% 80%, rgba(220, 38, 38, 0.05), transparent 30%)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}