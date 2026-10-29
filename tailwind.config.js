/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Liquid Platinum Spatial Palette
        'obsidian-black': '#07080A',
        'deep-graphite': '#13161B',
        'metallic-platinum': '#D7DBE2',
        'brushed-silver': '#A6AFBB',
        'primary-text': '#F2F4F7',
        'secondary-text': '#9BA4B0',

        // Base semantic mappings
        canvas: '#07080A',
        surface: '#13161B',
        'surface-elevated': '#1A1E26',
        'surface-hover': '#202530',
        'border-enterprise': '#303642',
        'border-subtle': 'rgba(215, 219, 226, 0.15)',
        'silver-accent': '#D7DBE2',
        'text-secondary': '#9BA4B0',
        'text-primary': '#F2F4F7',

        // Backward-compatible color aliases
        midnight: '#07080A',
        obsidian: '#13161B',
        graphite: '#1A1E26',
        platinum: '#D7DBE2',
        'liquid-silver': '#9BA4B0',
        'highlight-silver': '#F2F4F7',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'enterprise': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'enterprise-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
        'enterprise-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
        'spatial-window': '0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 1px rgba(215, 219, 226, 0.2)',
        'spatial-capsule': '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 1px rgba(215, 219, 226, 0.15)',
      },
      borderRadius: {
        'enterprise': '8px',
        'enterprise-lg': '12px',
        'spatial': '24px',
        'spatial-lg': '32px',
      }
    },
  },
  plugins: [],
}
