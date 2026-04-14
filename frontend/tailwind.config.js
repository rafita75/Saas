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
            DEFAULT: '#6366F1',
            dark: '#4F46E5',
            light: '#818CF8',
          },
          secondary: {
            DEFAULT: '#8B5CF6',
            dark: '#7C3AED',
            light: '#A78BFA',
          },
          accent: {
            DEFAULT: '#06B6D4',
            dark: '#0891B2',
            light: '#22D3EE',
          },
          dark: {
            950: '#020617',
            900: '#0F172A',
            800: '#1E293B',
            700: '#334155',
          }
        },
        animation: {
          'fade-in': 'fadeIn 0.8s ease-out forwards',
          'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
          'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'float': 'float 6s ease-in-out infinite',
          'pulse-slow': 'pulse 3s ease-in-out infinite',
          'shimmer': 'shimmer 2s infinite',
          'scale-up': 'scaleUp 0.3s ease-out forwards',
          'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInDown: {
            '0%': { opacity: '0', transform: 'translateY(-20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
            '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' },
          },
          scaleUp: {
            '0%': { transform: 'scale(0.95)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          slideInRight: {
            '0%': { transform: 'translateX(50px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'mesh-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
          'glass-gradient': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        },
        backdropBlur: {
          xs: '2px',
        },
      },
    },
    plugins: [],
  }