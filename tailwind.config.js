/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Near-OLED base, tinted toward brand hue
        base: "#070b16",
        surface: "#0d1424",
        "surface-2": "#131c31",
        line: "#1e2842",
        "line-bright": "#2b3a5e",
        ink: "#e8eefc",
        "ink-dim": "#9aa7c7",
        "ink-faint": "#8593b4",
        // Brand identity (bytefront)
        cyan: "#7bd0ff",
        mint: "#4edea3",
        gold: "#ffd166",
      },
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
        body: ["Onest", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        content: "76rem",
      },
    },
  },
  plugins: [],
};
