import { describe, expect, it } from 'vite-plus/test'

import { getInitialPrecacheFiles } from './generate-sw'

describe('getInitialPrecacheFiles', () => {
  it('selects the static entry closure deterministically without dynamic imports', () => {
    const files = getInitialPrecacheFiles({
      'src/home-shared.ts': { file: 'assets/home-shared.js' },
      'src/lazy-editor.tsx': { file: 'assets/editor.js' },
      'src/main.tsx': {
        assets: ['assets/logo.svg'],
        css: ['assets/main.css'],
        dynamicImports: ['src/lazy-editor.tsx'],
        file: 'assets/main.js',
        imports: ['src/shared.ts'],
        isEntry: true,
      },
      'src/routes/index.tsx?tsr-split=component': { file: 'assets/home.js', imports: ['src/home-shared.ts'] },
      'src/shared.ts': { assets: ['assets/font.woff2'], file: 'assets/shared.js' },
    })

    expect(files).toEqual([
      'assets/font.woff2',
      'assets/home-shared.js',
      'assets/home.js',
      'assets/logo.svg',
      'assets/main.css',
      'assets/main.js',
      'assets/shared.js',
      'favicon.ico',
      'fonts/bricolage-grotesque-latin-ext.woff2',
      'fonts/bricolage-grotesque-latin.woff2',
      'icon-192.png',
      'icon-512.png',
      'index.html',
      'manifest.json',
    ])
    expect(files).not.toContain('assets/editor.js')
  })
})
