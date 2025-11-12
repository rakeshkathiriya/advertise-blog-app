import type { Config } from 'tailwindcss';

const tailwindConfig: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
        },
      },
    },
  },
  darkMode: ['class', 'class'], // Enable class-based dark mode
};
export default tailwindConfig;
