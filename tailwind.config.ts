import type { Config } from 'tailwindcss'
import fluid, {
  extract,
  screens,
  fontSize,
} from 'fluid-tailwind'

const config: Config = {
  content: {
    files: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    extract,
  },
  theme: {
    screens,
    fontSize,
    /** @type {import('fluid-tailwind').FluidThemeConfig} */
    // fluid: ({ theme }) => ({
    //   defaultScreens: ['20rem', theme('screens.lg')],
    // }),
  },
  corePlugins: {
    // fontSize: false,
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    fluid({
      checkSC144: false, // default: true
    }),
  ],
}
export default config
