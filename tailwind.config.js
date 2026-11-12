/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F1ECE2',
        asphalt: {
          DEFAULT: '#1A1C1E',
          soft: '#25292D',
          muted: '#363B40',
        },
        orange: {
          DEFAULT: '#E4501D',
          hover: '#C83E0F',
          soft: '#FCECE6',
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
        heading: ['"Barlow Condensed"', '"Noto Sans Devanagari"', 'sans-serif'],
        body: ['"Instrument Sans"', '"Noto Sans Devanagari"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Noto Sans Devanagari"', 'monospace'],
      },
      boxShadow: {
        'stamp-sm': '2px 2px 0px #1A1C1E',
        'stamp': '3px 3px 0px #1A1C1E',
        'stamp-lg': '5px 5px 0px #1A1C1E',
        'stamp-orange': '3px 3px 0px #E4501D',
        'stamp-teal': '3px 3px 0px #1D5A52',
        'stamp-yellow': '3px 3px 0px #E5A823',
        'stamp-white': '3px 3px 0px #FAF7F0',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '3px',
        lg: '4px',
      },
      borderWidth: {
        DEFAULT: '1.5px',
        '1.5': '1.5px',
      }
    },
  },
  plugins: [],
}
