/* Tailwind config for Easyappz classifieds */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0A84FF',
        },
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#0F172A',
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtils = {
        '.shadow-soft': {
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }
      };
      addUtilities(newUtils, ['responsive']);
    }
  ],
};
