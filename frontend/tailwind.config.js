/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Inter"',
          "system-ui",
          "sans-serif"
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          "ui-monospace",
          "monospace"
        ],
      },
      colors: {
        canvas: '#F5F5F7',
        surface: '#FFFFFF',
        borderSubtle: '#E5E5EA',
        borderStrong: '#D2D2D7',
        charcoal: '#1D1D1F',
        mutedGray: '#6E6E73',
        lightGray: '#86868B',
        appleBlue: {
          DEFAULT: '#0071E3',
          hover: '#0077ED',
          active: '#0062C4',
          subtle: '#EBF4FE'
        },
        appleGreen: {
          DEFAULT: '#34C759',
          dark: '#1E7E34',
          light: '#E8F8EE'
        },
        appleRed: {
          DEFAULT: '#FF3B30',
          dark: '#D70015',
          light: '#FEECEC'
        },
        appleAmber: {
          DEFAULT: '#FF9500',
          dark: '#B25000',
          light: '#FFF5E5'
        }
      },
      boxShadow: {
        'apple-card': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'apple-button': '0 4px 14px rgba(0, 113, 227, 0.25)',
        'apple-dropdown': '0 8px 24px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
