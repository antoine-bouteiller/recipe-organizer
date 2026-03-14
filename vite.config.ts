import { cloudflare } from '@cloudflare/vite-plugin'
import babel from '@rolldown/plugin-babel'
import { serwist } from '@serwist/vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const viteConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    react(),
    cloudflare({
      viteEnvironment: { name: 'ssr' },
    }),
    tailwindcss(),
    serwist({
      swSrc: 'src/sw.ts',
      swDest: 'sw.js',
      globDirectory: 'dist',
      injectionPoint: 'self.__SW_MANIFEST',
      rollupFormat: 'iife',
    }),
    devtools(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    port: 3000,
  },
})

export default viteConfig
