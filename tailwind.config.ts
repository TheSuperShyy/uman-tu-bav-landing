import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hero: '#b89e8b',
        cream: '#fffcf9',
        'cream-alt': '#fffbf9',
        accent: '#c3957d',
        'accent-soft': '#e6d2c4',
        button: '#87573e',
        'button-text': '#eeecea',
        'ink-deep': '#6b4532',
        'ink-body': '#2d2d2d',
        divider: '#efe5dc',
      },
      fontFamily: {
        sans: ['Assistant', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '906px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(107, 69, 50, 0.06), 0 8px 24px rgba(107, 69, 50, 0.08)',
        cta: '0 6px 18px rgba(135, 87, 62, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
