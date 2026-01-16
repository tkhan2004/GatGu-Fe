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
        primary: "#2C7DA0",
        "primary-hover": "#1557c0",
        "primary-dark": "#0284c7",
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
        "surface-light": "#ffffff",
        "surface-dark": "#1E293B",
        "secondary-light": "#E2E8F0",
        "secondary-dark": "#1E293B",
        "text-light": "#334155",
        "text-dark": "#F1F5F9",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ["Inter", "Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
