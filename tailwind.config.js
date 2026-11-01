/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E1B2F', // Rich dark navy from client logo shield
          light: '#1A2E4C',
          dark: '#070D18',
        },
        secondary: {
          DEFAULT: '#1E293B',
          light: '#334155',
          dark: '#0E1B2F',
        },
        accent: {
          DEFAULT: '#C5A35C', // Vibrant Luxury Gold
          light: '#DEC38B',
          dark: '#9C7E41',
        },
        background: '#F9F8F6', // Warm luxury cream matching client logo tone
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
        'premium-hover': '0 20px 40px -10px rgba(15, 23, 42, 0.15)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      }
    },
  },
  plugins: [],
}
