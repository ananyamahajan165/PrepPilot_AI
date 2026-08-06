/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---------------------------------------------------------------
        // Centralized design tokens. Every themed surface/text/border/
        // button in the authenticated app is built from these — never
        // from raw slate/gray/white/black. Each token resolves to a CSS
        // variable (see src/index.css) that flips between a light and a
        // dark value when the `.dark` class is toggled on <html>, so a
        // component written once automatically supports both themes.
        // ---------------------------------------------------------------
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
        border: "var(--border)",
        fg: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          hover: "var(--danger-hover)",
        },

        // Legacy palette — still used for the marketing landing page,
        // which keeps its own always-dark identity by design, and for a
        // couple of decorative brand accents. Not used for themed surfaces.
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#3b6ef6",
          600: "#2f57cc",
          700: "#24439e",
        },
        ink: {
          950: "#0A0D14",
          900: "#10141D",
          800: "#171C27",
          700: "#232939",
        },
        gold: {
          300: "#F7CC79",
          400: "#F2B84B",
          500: "#E0A02F",
        },
        teal: {
          300: "#8FF3E1",
          400: "#5EEAD4",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "wave-drift": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "wave-drift": "wave-drift 2.4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
