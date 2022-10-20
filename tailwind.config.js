/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      '2xl': {'max': '2635px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1024px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '736px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '640px'},
      // => @media (max-width: 639px) { ... }
      'xs': {'max': '480px'},
    },
    extend: {},
  },
  plugins: [],
}
