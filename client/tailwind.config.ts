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
        themeColorBg: "var(--bg-color)",
        themeColorBgSoft: "var(--bg-colorSoft)",
        themeColorText: "var(--text-color)",
        themeColorTextSoft: "var(--text-colorSoft)",
      }
    },
  },
  plugins: [],
}
export default config
