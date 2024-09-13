import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],

  theme: {
  	extend: {
  		fontFamily: {
  			heading: ["var(--font-heading)", ...fontFamily.sans],
  			body: ["var(--font-body)", ...fontFamily.sans],
  			poppins: ["Poppins", ...fontFamily.sans]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },

  plugins: [require("daisyui"), require("tailwindcss-animate")],

  daisyui: {
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
