import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'
import { voidPlugin } from 'void'

const viteConfig = defineConfig({
  // The Worker owns unmatched requests; Vite's SPA fallback would answer API 404s with index.html.
  appType: 'mpa',
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
    voidPlugin({ persistTo: '.wrangler/state' }),
  ],
  server: {
    port: 3000,
  },
})

export default viteConfig
