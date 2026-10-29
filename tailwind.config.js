/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Liquid Glass Light Mode Palette
        canvas: '#EDF2F7',
        surface: '#FFFFFF',
        'surface-elevated': '#F8FAFC',
        'surface-hover': '#F1F5F9',
        'border-enterprise': '#E2E8F0',
        'border-subtle': 'rgba(226, 232, 240, 0.8)',
        'silver-accent': '#64748B',
        'text-secondary': '#64748B',
        'text-primary': '#0F172A',

        // Backward-compatible color aliases in Light Glass
        midnight: '#EDF2F7',
        obsidian: '#FFFFFF',
        graphite: '#F8FAFC',
        platinum: '#0F172A',
        'liquid-silver': '#64748B',
        'highlight-silver': '#0F172A',
        'glass-border': '#E2E8F0',
        'glass-border-bright': 'rgba(255, 255, 255, 0.95)',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'enterprise': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'enterprise-md': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'enterprise-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06)',
        'spatial-window': '0 30px 80px -15px rgba(15, 23, 42, 0.12), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95)',
        'spatial-capsule': '0 18px 45px rgba(15, 23, 42, 0.08), inset 0 1px 2px 0 rgba(255, 255, 255, 1)',
        'glass-panel': '0 10px 30px -10px rgba(15, 23, 42, 0.08), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)',
        'active-pod': '0 12px 35px -5px rgba(37, 99, 235, 0.18), 0 0 0 1.5px #2563EB',
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
