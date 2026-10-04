import type { StorybookConfig } from '@storybook/svelte-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const config: StorybookConfig = {
  addons: ['@storybook/addon-svelte-csf'],
  core: { disableTelemetry: true },
  framework: '@storybook/svelte-vite',
  stories: ['../src/**/*.stories.svelte'],
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
