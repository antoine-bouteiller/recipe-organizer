import type { StorybookConfig } from '@storybook/svelte-vite'

const config: StorybookConfig = {
  addons: ['@storybook/addon-svelte-csf'],
  core: { disableTelemetry: true },
  framework: '@storybook/svelte-vite',
  stories: ['../src/**/*.stories.svelte'],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      tsconfigPaths: true,
    },
  }),
}

export default config
