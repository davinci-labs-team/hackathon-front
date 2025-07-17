import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      screens: {
        '16-9': '1536px', // support écran 1920x1080 (16:9)
      },
    },
  },
  plugins: [],
}

export default config
