import type { Config } from 'tailwindcss';

// 配色は実店舗から取っている:
//   wall  … 店内の白い壁
//   pine  … 商品を並べている白木の棚板
//   board … 看板の板の色
//   sky   … 看板の顔イラストの水色
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wall: '#FFFFFF',
        ink: {
          DEFAULT: '#22262A',
          soft: '#565C62',
        },
        line: '#E1E3E0',
        pine: {
          DEFAULT: '#D3AF7C',
          edge: '#B58A52',
          light: '#F4EBDD',
        },
        board: {
          DEFAULT: '#6B4A2B',
          text: '#F3EBDD',
          soft: '#DCCDB6',
        },
        sky: {
          50: '#EEF8FD',
          200: '#AEDDF3',
          700: '#1D5E86',
        },
      },
      fontFamily: {
        maru: ['var(--font-maru)', 'Hiragino Maru Gothic ProN', 'sans-serif'],
      },
      maxWidth: {
        shop: '76rem',
      },
    },
  },
  plugins: [],
};
export default config;
