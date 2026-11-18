/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Enterprise SaaS Palette
        navy: {
          DEFAULT: '#0F172A', // Primary Navy Default
          950: '#0A0F1D',
          900: '#0F172A', // Primary Navy
          800: '#1E293B', // Secondary Navy
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0', // Enterprise Border
          100: '#F1F5F9',
          50: '#F8FAFC',  // Enterprise Main Background
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        secondary: {
          DEFAULT: '#64748B',
          foreground: '#0F172A',
        },
        orange: {
          DEFAULT: '#F97316', // Accent Orange
          hover: '#EA580C',   // Orange Hover
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          soft: '#FFF7ED',
        },
        // Legacy tokens retained for backward compatibility with public pages
        paper: '#F1ECE2',
        asphalt: {
          DEFAULT: '#1A1C1E',
          soft: '#25292D',
          muted: '#363B40',
        },
        teal: {
          DEFAULT: '#1D5A52',
          hover: '#16453F',
          soft: '#EAF3F1',
        },
        yellow: {
          DEFAULT: '#E5A823',
          hover: '#CE9317',
          soft: '#FCF6E8',
        },
        steel: {
          DEFAULT: '#6E7A82',
          light: '#A0ACB4',
          dark: '#485258',
          border: '#D0D6DC',
        },
        chalk: '#FAF7F0',
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'saas-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'saas': '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)',
        'saas-md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'saas-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        // Retained legacy stamp shadows
        'stamp-sm': '2px 2px 0px #1A1C1E',
        'stamp': '3px 3px 0px #1A1C1E',
        'stamp-lg': '5px 5px 0px #1A1C1E',
        'stamp-orange': '3px 3px 0px #E4501D',
        'stamp-teal': '3px 3px 0px #1D5A52',
        'stamp-yellow': '3px 3px 0px #E5A823',
        'stamp-white': '3px 3px 0px #FAF7F0',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      borderWidth: {
        DEFAULT: '1px',
        '1.5': '1.5px',
      }
    },
  },
  plugins: [],
}
