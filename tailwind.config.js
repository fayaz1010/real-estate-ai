/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm & Trustworthy palette
        primary: "#2C3E50",
        secondary: "#8B7355",
        accent: "#C9956B",
        background: "#FAF6F1",
        text_primary: "#1A1A2E",
        // Legacy aliases for existing components
        "realestate-primary": "#2C3E50",
        "realestate-secondary": "#8B7355",
        "realestate-accent": "#C9956B",
        "realestate-background": "#FAF6F1",
        "realestate-text": "#1A1A2E",
        "realestate-surface": "#FFFFFF",
        "realestate-text-secondary": "#6599ac",
        "realestate-text-muted": "#94a3b8",
        "realestate-border": "#cbd5e1",
        "realestate-success": "#34d399",
        "realestate-warning": "#fde047",
        "realestate-error": "#ef4444",
      },
      fontFamily: {
        display: ["Instrument Serif", "serif"],
        body: ["DM Sans", "sans-serif"],
        montserrat: ["Instrument Serif", "serif"],
        "open-sans": ["DM Sans", "sans-serif"],
        "roboto-mono": ["Roboto Mono", "monospace"],
        // Legacy aliases pointing to new fonts
        "space-grotesk": ["Instrument Serif", "serif"],
        inter: ["DM Sans", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      borderRadius: {
        "realestate-sm": "0.125rem",
        "realestate-md": "0.375rem",
        "realestate-lg": "0.5rem",
      },
      boxShadow: {
        "realestate-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "realestate-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "realestate-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        container: "1280px",
      },
      animation: {
        blob: "blob 7s infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        shake: "shake 0.5s ease-in-out",
        "scale-up": "scaleUp 0.2s ease-out",
        ripple: "ripple 0.6s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  plugins: [],
};
