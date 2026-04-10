import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-elevated": "var(--color-bg-secondary)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        border: "var(--color-border)",
        "border-glow": "var(--color-border-glow)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-glow": "var(--color-primary-glow)",
        accent: "var(--color-accent)",
        "accent-glow": "var(--color-accent-glow)",
        "accent-warm": "var(--color-accent-warm)",
        "neon-cyan": "var(--color-neon-cyan)",
        "neon-pink": "var(--color-neon-pink)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-subtle": "var(--color-text-subtle)",
        "input-bg": "var(--color-input-bg)",
        "input-border": "var(--color-input-border)",
        "input-placeholder": "var(--color-input-placeholder)",
        heading: "var(--color-heading)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        glow: "var(--shadow-glow)",
        "primary-glow": "0 0 20px var(--color-primary-glow)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular"],
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        h1: ["var(--text-h1)", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        h2: ["var(--text-h2)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["var(--text-h3)", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "600" }],
        body: ["var(--text-body)", { lineHeight: "1.7" }],
        sm: ["var(--text-sm)", { lineHeight: "1.6" }],
        xs: ["var(--text-xs)", { lineHeight: "1.5" }],
      },
      keyframes: {
        "shimmer-x": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "shimmer-x": "shimmer-x 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

export default config
