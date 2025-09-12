// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { workboxGeneratePlugin } from './sw-generate'
import { sentryRollupPlugin } from '@sentry/rollup-plugin'
import react from '@vitejs/plugin-react'

const viteConfig = defineConfig({
  server: {
    port: 3000,
    watch: {
      ignored: ['.wrangler/**/*'],
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    tsConfigPaths(),
    react({
      exclude: ['**/.wrangler/**/*'],
    }),
    tanstackStart({
      customViteReactPlugin: true,
      target: 'cloudflare-module',
    }),
    tailwindcss(),
    workboxGeneratePlugin(),
    sentryRollupPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'antoine-bouteiller',
      project: 'recipe-orgnanizer',
      sourcemaps: {
        filesToDeleteAfterUpload: ['.tanstack/start/build/client-dist/**/*.map'],
      },
    }),
  ],
})

export default viteConfig
