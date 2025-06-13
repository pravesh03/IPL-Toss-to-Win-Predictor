/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
"./src/**/*.{js,jsx,ts,tsx}",
],
theme: {
    extend: {
      colors: {
        stadium: {
          dark: '#1a1a1a',
          light: '#2a1f1f',
          accent: '#3a2a2a',
        }
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'marquee': 'marquee 25s linear infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)',
            'animation-timing-function': 'ease-in-out'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(5deg)',
            'animation-timing-function': 'ease-in-out'
          }
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      opacity: {
        '15': '0.15'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'stadium-texture': 'url("/stadium.png")'
      },
      boxShadow: {
        'glow': '0 0 15px -3px rgba(245, 158, 11, 0.5)',
      }
    },
    backgroundSize: {
      '200%': '200% 200%',
    },
},
plugins: [],
};