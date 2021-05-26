module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // tree-shake unused css in production
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        whirl: 'whirl 1s linear',
        'whirl-reverse': 'whirl-reverse 1s linear',
      },
      keyframes: {
        whirl: {
          '0%': { transform: 'rotateY(0deg)', opacity: 1 },
          '25%': { transform: 'rotateY(90deg)', opacity: 0.3 },
          '50%': { transform: 'rotateY(120deg)', opacity: 0 },
          '75%': { transform: 'rotateY(150deg)', opacity: 0.3 },
          '100%': { transform: 'rotateY(180deg)', opacity: 1 },
        },
        'whirl-reverse': {
          '0%': { transform: 'rotateY(180deg)', opacity: 1 },
          '25%': { transform: 'rotateY(150deg)', opacity: 0.3 },
          '50%': { transform: 'rotateY(120deg)', opacity: 0 },
          '75%': { transform: 'rotateY(90deg)', opacity: 0.3 },
          '100%': { transform: 'rotateY(180deg)', opacity: 1 },
        },
      },
      backgroundImage: (theme) => ({
        darwinia: 'linear-gradient(-45deg, #fe3876 0%, #7c30dd 71%, #3a30dd 100%)',
      }),
      backgroundColor: (theme) => ({
        crab: '#EC3783',
        pangolin: '#5745DE',
      }),
      borderRadius: {
        xl: '10px',
        lg: '8px',
      },
    },
  },
};
