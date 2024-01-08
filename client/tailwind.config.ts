import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        themeColorBg: "rgb(var(--bg-color))",
        themeColorBgSoft: "rgb(var(--bg-colorSoft))",
        themeColorText: "rgb(var(--text-color))",
      }
    },
  },
  plugins: [],
}
export default config
