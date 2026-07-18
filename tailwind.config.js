/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        card: "var(--card)",
        muted: "var(--muted)",
        'muted-foreground': "var(--muted-foreground)",
        primary: {
          DEFAULT: "#00AEEF",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#28C76F",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#FF9F43",
          foreground: "#ffffff",
        },
        danger: {
          DEFAULT: "#EA5455",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        heading: ["var(--font-heading)", "Outfit", "sans-serif"],
        stat: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        premium: "0 24px 70px rgba(2, 8, 23, 0.16)",
        card: "0 32px 90px rgba(2, 8, 23, 0.18)",
      },
    },
  },
  plugins: [],
};
