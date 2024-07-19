/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/utils/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        osw: ["Oswald", "sans-serif"],
        primaryHeader: ["Yanone Kaffeesatz", "sans-serif"],
        ibm: ["IBM Plex Mono", "monospace"],
        apple: ["-apple-system", "sans-serif"],
        hand: ["Caveat", "cursive"]
      },
      colors: {
        primary400: "#4a6b87", // Lighter
        primary500: "#35546e", // Original
        primary600: "#2a4355", // Darker
        primary700: "#3a5d7c", // Alternative Hue
        primary800: "#6e4d35", // Complementary Color
        secondary200: "#f9e0b0", // Lightest
        secondary300: "#f7d59b", // Lighter
        secondary400: "#f6c56b", // Lighter
        secondary500: "#f3b952", // Original
        secondary600: "#d19a46", // Darker
        secondary700: "#e5a84a", // Alternative Hue
        secondary800: "#5293f3" // Complementary Color
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
