import type { StorybookConfig } from '@storybook/svelte-vite'

const config: StorybookConfig = {
  addons: ['@storybook/addon-svelte-csf'],
  core: { disableTelemetry: true },
  framework: '@storybook/svelte-vite',
  stories: ['../src/**/*.stories.svelte'],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    // @void/svelte ships uncompiled TypeScript runes that the dependency optimizer cannot parse.
    optimizeDeps: { ...viteConfig.optimizeDeps, exclude: [...(viteConfig.optimizeDeps?.exclude ?? []), '@void/svelte'] },
    resolve: {
      ...viteConfig.resolve,
      tsconfigPaths: true,
    },
  }),
}

export default config
