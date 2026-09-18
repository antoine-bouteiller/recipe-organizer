import { type StorybookConfig } from '@storybook/react-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const config: StorybookConfig = {
  core: { disableTelemetry: true },
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx'],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), vanillaExtractPlugin()],
    resolve: {
      ...viteConfig.resolve,
      tsconfigPaths: true,
    },
  }),
}

export default config
