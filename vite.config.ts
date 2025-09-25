// vite.config.ts
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { workboxGeneratePlugin } from './sw-generate'

const viteConfig = defineConfig({
  server: {
    port: 3000,
    watch: {
      ignored: ['.wrangler/**/*'],
    },
  },
  plugins: [
    tsConfigPaths(),
    react({
      exclude: ['**/.wrangler/**/*'],
    }),
    tanstackStart(),
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
    tailwindcss(),
    workboxGeneratePlugin(),
  ],
})

export default viteConfig
