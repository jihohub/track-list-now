import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        navyBlue: "#12086f",
        persianBlue: "#2b35af",
        neonBlue: "#4361ee",
        chefchaouenBlue: "#4895ef",
        vividSkyBlue: "#4cc9f0",
      },
    },
  },
  plugins: [],
};
export default config;
