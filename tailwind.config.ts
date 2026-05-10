import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          green: "#4F5D44", // Gum Tree Green
          cream: "#F9F6F0",
          wood: "#8B5A2B", // Warm Wood
          woodDark: "#5C3A21",
        }
      },
    },
  },
  plugins: [],
};
export default config;
