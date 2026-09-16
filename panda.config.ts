import { resolve } from 'node:path'

import { defineConfig } from '@pandacss/dev'

import { conditions } from './packages/design-system/src/theme/conditions'
import { theme } from './packages/design-system/src/theme/tokens'

const isStorybook = process.env.PANDA_STORYBOOK === '1'
const sourceGlobs = ['apps/web/src/**/*.{ts,tsx}', 'packages/design-system/src/**/*.{ts,tsx}']

export default defineConfig({
  conditions,
  cwd: __dirname,
  exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts', ...(isStorybook ? [] : ['**/*.stories.{ts,tsx}'])].map((glob) => resolve(__dirname, glob)),
  importMap: '@recipe-organizer/design-system',
  include: [...sourceGlobs, ...(isStorybook ? ['packages/design-system/.storybook/**/*.{ts,tsx}'] : [])].map((glob) => resolve(__dirname, glob)),
  jsxStyleProps: 'none',
  layers: { base: 'panda-base', recipes: 'panda-recipes', reset: 'panda-reset', tokens: 'panda-tokens', utilities: 'panda-utilities' },
  outdir: 'packages/design-system/styled-system',
  preflight: false,
  theme,
})
