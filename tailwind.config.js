/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        background: 'rgb(var(--background-rgb) / <alpha-value>)',
        text: 'rgb(var(--text-rgb) / <alpha-value>)',
        // Tenant Portal - Authoritative corporate palette
        "tenant-primary": "#091a2b",
        "tenant-secondary": "#005163",
        "tenant-accent": "#3b4876",
        "tenant-bg": "#f1f3f4",
        "tenant-text": "#091a2b",
        // Professional Trust palette
        "realestate-primary": "#008080",
        "realestate-secondary": "#E0E0E0",
        "realestate-accent": "#FF6B35",
        "realestate-background": "#FFFFFF",
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
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        // Legacy aliases pointing to design system fonts
        montserrat: ["Manrope", "sans-serif"],
        "open-sans": ["Inter", "sans-serif"],
        "roboto-mono": ["JetBrains Mono", "monospace"],
        "space-grotesk": ["Manrope", "sans-serif"],
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
        xxs: 'var(--space-xxs)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        xxl: 'var(--space-xxl)',
        '3xl': 'var(--space-3xl)',
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
        'button-press': 'button-press 0.3s ease-in-out',
        'inline-form-validation-error': 'inline-form-validation-error 0.3s ease-in-out',
        'skeleton-loading': 'skeleton-loading 1s linear infinite alternate',
      },
      keyframes: {
        'button-press': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        'inline-form-validation-error': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%, 75%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
        },
        'skeleton-loading': {
          '0%': { backgroundColor: 'hsl(180, 10%, 85%)' },
          '100%': { backgroundColor: 'hsl(180, 10%, 95%)' },
        },
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
