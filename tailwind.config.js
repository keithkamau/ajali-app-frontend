/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "#f9f9f8",
        surface: "#ffffff",
        border: "#e4e4e0",
        ink: "#111110",
        "ink-muted": "#6b6b66",
        red: "#dc2626",
        "red-light": "#fef2f2",
        "red-mid": "#fca5a5",
        amber: "#d97706",
        "amber-light": "#fffbeb",
        green: "#16a34a",
        "green-light": "#f0fdf4",
        navy: "#0f172a",
      },
      fontFamily: {
        display: ["DM Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
