import path from 'node:path'

import { type StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  core: { disableTelemetry: true },
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx'],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    css: { ...viteConfig.css, postcss: path.resolve(import.meta.dirname, '../../../postcss.config.cjs') },
  }),
}

export default config
