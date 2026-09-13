import path from 'node:path'

import { serwistPlugin } from '@recipe-organizer/scripts/generate-sw'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

const viteConfig = defineConfig({
  envDir: path.join(import.meta.dirname, '../..'),
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      onLog(level, log, defaultHandler) {
        // Supress Lexical Warning
        if (log.code === 'INVALID_ANNOTATION') {
          return
        }
        // Handle all other logs normally
        defaultHandler(level, log)
      },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({ compiler: true }),
    tailwindcss(),
    serwistPlugin(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  test: {
    name: 'web',
    root: import.meta.dirname,
    include: ['src/**/*.test.ts'],
  },
})

export default viteConfig
