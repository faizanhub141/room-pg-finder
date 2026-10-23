export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#1c1c28', petrol: { DEFAULT: '#1b3a8c', dark: '#12296a' }, marigold: '#ffcf33', mist: '#eef0f3', stamp: '#c8372d' },
      fontFamily: { display: ['"Baloo 2"', 'system-ui', 'sans-serif'], sans: ['Mukta', 'system-ui', 'sans-serif'] },
      borderRadius: { lg: '3px', xl: '4px', '2xl': '4px' },
    },
  },
  plugins: [],
};
