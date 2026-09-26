import path from 'node:path'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

const viteConfig = defineConfig({
  envDir: path.join(import.meta.dirname, '../..'),
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    vanillaExtractPlugin(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({ compiler: true }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    name: 'web',
    root: import.meta.dirname,
    include: ['src/**/*.test.ts'],
  },
})

export default viteConfig
