/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enables dark mode via class strategy
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color)',
        'primary-hover-color': 'var(--primary-hover-color)',
        'accent-color': 'var(--accent-color)',
        'text-color': 'var(--text-color)',
        'secondary-text-color': 'var(--secondary-text-color)',
        'card-background': 'var(--card-background)',
        'input-background': 'var(--input-background)',
        'border-color': 'var(--border-color)',
        'error-color': 'var(--error-color)',
        'product-price': 'var(--product-price)',
      },
      borderRadius: {
        'radius': 'var(--border-radius)',
        'radius-sm': 'var(--border-radius-sm)',
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
        'card-hover': 'var(--card-hover-shadow)',
        'button': 'var(--button-shadow)',
        'button-hover': 'var(--button-hover-shadow)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
