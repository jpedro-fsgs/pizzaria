import { plugin } from "postcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["mytheme"],
    themes: [
      {
        mytheme: {
          primary: "#E7191F",

          secondary: "#facc15",

          accent: "#fecaca",

          neutral: "#111827",

          "base-100": "#e5e7eb",

          info: "#111827",

          success: "#22c55e",

          warning: "#fb923c",

          error: "#E7191F",
        },
      },
    ],
  },
};
