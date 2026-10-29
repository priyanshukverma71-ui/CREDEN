/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#08090B',
        surface: '#14171B',
        'surface-elevated': '#1A1E24',
        'surface-hover': '#20252D',
        'border-enterprise': '#22262C',
        'border-subtle': 'rgba(210, 214, 220, 0.12)',
        'silver-accent': '#D2D6DC',
        'text-secondary': '#929AA5',
        'text-primary': '#F1F3F5',
        // Backward-compatible color aliases
        midnight: '#08090B',
        obsidian: '#14171B',
        graphite: '#1A1E24',
        platinum: '#D2D6DC',
        'liquid-silver': '#929AA5',
        'highlight-silver': '#F1F3F5',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'enterprise': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'enterprise-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
        'enterprise-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        'enterprise': '8px',
        'enterprise-lg': '12px',
      }
    },
  },
  plugins: [],
}
