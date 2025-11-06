/* Easyappz Tailwind config */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0A84FF",
          dark: "#0B1320"
        },
        ink: {
          900: "#0b0b0b",
          800: "#1a1a1a",
          700: "#2a2a2a",
          600: "#3a3a3a",
          500: "#4f4f4f",
          400: "#6b7280",
          300: "#9ca3af",
          200: "#d1d5db",
          100: "#e5e7eb",
          50:  "#f5f5f7"
        }
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)",
        hover: "0 8px 24px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "14px"
      }
    },
  },
  plugins: [],
};
