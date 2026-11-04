import type { Config } from 'tailwindcss';

// 店の看板（茶色の板・水色の顔）と、トレカ店でおなじみの赤い値札・黄色の札で組む。
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1E2329',
          soft: '#5A6169',
        },
        mist: '#F3F5F7',
        line: '#DDE1E6',
        board: '#5A3D24',
        sky: {
          DEFAULT: '#AEDDF3',
          deep: '#1D5E86',
          pale: '#EAF6FC',
        },
        tag: '#D7261E',
        hilite: '#FFD84D',
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
        site: '1080px',
      },
    },
  },
  plugins: [],
};
export default config;
