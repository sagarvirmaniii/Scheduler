/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ─── Primary Blue (Cal.com / Stripe style) ───────────────────────
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',  // primary action
          700: '#1D4ED8',  // hover
          800: '#1E40AF',  // active / pressed
          900: '#1E3A8A',  // dark accent
        },
        // ─── Neutral / Surface ───────────────────────────────────────────
        surface: {
          page:   '#EFF6FF',  // page background — light blue (blue-50)
          card:   '#FFFFFF',
          subtle: '#DBEAFE',  // subtle bg
          hover:  '#DBEAFE',  // row hover
        },
        // ─── Borders ─────────────────────────────────────────────────────
        border: {
          DEFAULT: '#E2E8F0',
          strong:  '#CBD5E1',
          focus:   '#2563EB',
        },
        // ─── Text ────────────────────────────────────────────────────────
        ink: {
          primary:   '#0F172A',
          secondary: '#475569',
          muted:     '#94A3B8',
          disabled:  '#CBD5E1',
          inverse:   '#FFFFFF',
          link:      '#2563EB',
        },
        // ─── State colors ─────────────────────────────────────────────────
        success: {
          bg:   '#F0FDF4',
          border:'#BBF7D0',
          text: '#15803D',
          icon: '#22C55E',
        },
        danger: {
          bg:   '#FFF1F2',
          border:'#FECDD3',
          text: '#BE123C',
          icon: '#F43F5E',
        },
        warning: {
          bg:   '#FFFBEB',
          border:'#FDE68A',
          text: '#B45309',
          icon: '#F59E0B',
        },
        info: {
          bg:   '#EFF6FF',
          border:'#BFDBFE',
          text: '#1D4ED8',
          icon: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card:   '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
        'brand-sm': '0 1px 3px 0 rgb(37 99 235 / 0.25)',
        'brand-md': '0 4px 12px 0 rgb(37 99 235 / 0.20)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
