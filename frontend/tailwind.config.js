/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: {
          900: '#0f172a',
          700: '#334155',
        },
        clay: {
          50: '#f9f5ef',
          100: '#f3ede3',
          200: '#e7dcc9',
        },
        sea: {
          600: '#1f7a8c',
          700: '#175c68',
        },
        sunset: {
          400: '#f59e0b',
          500: '#e07a1f',
        },
      },
      boxShadow: {
        float: '0 20px 50px -20px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}

