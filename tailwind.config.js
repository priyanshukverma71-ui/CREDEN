/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#08090B',
        obsidian: '#111317',
        graphite: '#1A1D22',
        platinum: '#D4D7DC',
        'liquid-silver': '#9299A3',
        'highlight-silver': '#F1F3F5',
        // dark glass tones
        'glass-black': 'rgba(8, 9, 11, 0.78)',
        'glass-border': 'rgba(212, 215, 220, 0.16)',
        'glass-border-bright': 'rgba(212, 215, 220, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'platinum-glow': '0 0 25px rgba(212, 215, 220, 0.12)',
        'glass-panel': '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(241, 243, 245, 0.15)',
        'active-pod': '0 10px 40px rgba(212, 215, 220, 0.18), inset 0 0 15px rgba(212, 215, 220, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'xl': '24px',
      }
    },
  },
  plugins: [],
}
