/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#060D1F',
        accent: '#3A8FE8',
        'accent-h': '#5AAAF5',
        'accent-d': '#1E6FC4',
        navy: '#060D1F',
        'navy-2': '#0B1527',
        'navy-3': '#111E36',
        'navy-4': '#1A2D4A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
