// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react-oxc'
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
    tanstackStart({ customViteReactPlugin: true, target: 'cloudflare-module' }),
    viteReact({ exclude: ['**/.wrangler/**/*'] }),
    tailwindcss(),
    workboxGeneratePlugin(),
  ],
})

export default viteConfig
