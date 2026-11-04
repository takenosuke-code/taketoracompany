import type { Config } from 'tailwindcss';

// 京都の個人店のサイトにならって、紙のような地色・こげ茶の文字・点線の区切りだけで組む。
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#EEE9DF',
        ink: {
          DEFAULT: '#3B332B',
          soft: '#6B6157',
        },
        rule: '#B9AE9F',
        wood: '#6B4A2B',
      },
      fontFamily: {
        jp: [
          'var(--font-jp)',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Yu Gothic',
          'Meiryo',
          'sans-serif',
        ],
      },
      maxWidth: {
        site: '920px',
      },
    },
  },
  plugins: [],
};
export default config;
