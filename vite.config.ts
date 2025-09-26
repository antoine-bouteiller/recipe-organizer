// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { serwist } from '@serwist/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const viteConfig = defineConfig({
  server: {
    port: 3000,
    watch: {
      ignored: ['.wrangler/**/*'],
    },
  },
  plugins: [
    tsConfigPaths(),
    react(),
    tanstackStart(),
    tailwindcss(),
    serwist({
      swSrc: 'src/sw.ts',
      swDest: 'sw.js',
      globDirectory: 'dist',
      injectionPoint: 'self.__SW_MANIFEST',
    }),
    cloudflare(),
  ],
})

export default viteConfig
