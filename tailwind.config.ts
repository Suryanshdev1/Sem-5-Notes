import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        ink: '#111111',
        nb: {
          yellow: '#FFD93D',
          green: '#4ADE80',
          pink: '#FF6B9D',
          purple: '#A78BFA',
          orange: '#FB923C',
          blue: '#60A5FA',
        },
      },
      boxShadow: {
        'nb-sm': '2px 2px 0 0 #111111',
        nb: '4px 4px 0 0 #111111',
        'nb-lg': '6px 6px 0 0 #111111',
      },
      fontFamily: {
        sans: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;