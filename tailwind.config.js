import defaultTheme from 'tailwindcss/defaultTheme';


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Noto Sans TC', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'theme': "#3182A8",
        'ft-bg-from': "#3182A8",
        'ft-bg-via': "#0039A2",
        'ft-bg-to': "#4600B0"
      }
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('flowbite/plugin')],
}

