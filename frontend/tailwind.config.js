/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
        colors: {
            gray: {
                500: 'rgba(142, 142, 160, var(--tw-text-opacity))',
            },
            bgColor: 'var(--collection-1-bg)',
        },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

