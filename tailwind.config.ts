import type { Config } from "tailwindcss";

// Palette ISSET :
// - "nuit"   : bleu nuit institutionnel (fond sombre, header, footer)
// - "cyan"   : bleu électrique / cyan — couleur d'accent (CTA, liens actifs, hover)
// - "or"     : touche dorée discrète (badges premium, séparateurs, éléments d'honneur)
// - "brume"  : gris très clair (fonds de section, cartes)
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nuit: {
          DEFAULT: "#0B1B3A",
          950: "#060F24",
          900: "#0B1B3A",
          800: "#122552",
          700: "#1A3268",
          600: "#22417F",
        },
        cyan: {
          DEFAULT: "#12B5D6",
          400: "#39CFEA",
          500: "#12B5D6",
          600: "#0D93AF",
        },
        or: {
          DEFAULT: "#C9A34E",
          400: "#DCC078",
          500: "#C9A34E",
        },
        brume: {
          DEFAULT: "#F5F7FA",
          100: "#FFFFFF",
          200: "#F5F7FA",
          300: "#E8ECF2",
          400: "#D3DAE3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        premium: "0 20px 60px -15px rgba(11,27,58,0.25)",
        glow: "0 0 40px rgba(18,181,214,0.35)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(18,181,214,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(201,163,78,0.10), transparent 35%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
