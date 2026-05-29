export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        livvic: ['Livvic', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
      },
      borderRadius: {
        'rounded-md': '0.5rem',
        'rounded-lg': '1rem',
      },
    },
  },
  plugins: [],
}
