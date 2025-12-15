import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-gold": "#b5984d",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
