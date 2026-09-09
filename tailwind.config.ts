import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#008CFF',
          green: '#7DFF00',
          gunmetal: '#2F3B46',
          offwhite: '#F5F7FA',
          dark: '#0B1220',
        },
      },
      maxWidth: {
        container: '1440px',
        content: '1280px',
      },
      boxShadow: {
        panel: '0 24px 80px rgba(11, 18, 32, 0.12)',
        glow: '0 20px 64px rgba(0, 140, 255, 0.25)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(125,255,0,0.18), transparent 22%), radial-gradient(circle at right center, rgba(0,140,255,0.28), transparent 26%), linear-gradient(180deg, rgba(11,18,32,1), rgba(12,23,38,1))',
        'subtle-grid':
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
    },
  },
  plugins: [typography],
}

export default config
