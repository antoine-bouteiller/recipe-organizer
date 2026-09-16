import { globSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { theme } from '@recipe-organizer/design-system/theme'
import { expect, it } from 'vite-plus/test'

it('multiplies one to four spacing values by 4px in CSS shorthand order', () => {
  expect(theme.spacing(1)).toBe('calc(4px * 1)')
  expect(theme.spacing(1, 2)).toBe('calc(4px * 1) calc(4px * 2)')
  expect(theme.spacing(1, 2, 3)).toBe('calc(4px * 1) calc(4px * 2) calc(4px * 3)')
  expect(theme.spacing(1, 2, 3, 4)).toBe('calc(4px * 1) calc(4px * 2) calc(4px * 3) calc(4px * 4)')
})

it('supports zero, fractional, negative, and previously unlisted spacing values', () => {
  expect(theme.spacing(0, 0.25, -1.5, 13)).toBe('calc(4px * 0) calc(4px * 0.25) calc(4px * -1.5) calc(4px * 13)')
})

it('exposes generic subtle color pairs instead of badge roles or the private palette', () => {
  expect(theme.colors).toMatchObject({
    'info-subtle': 'var(--colors-info-subtle)',
    'info-subtle-foreground': 'var(--colors-info-subtle-foreground)',
    'destructive-subtle': 'var(--colors-destructive-subtle)',
    'destructive-subtle-foreground': 'var(--colors-destructive-subtle-foreground)',
    'neutral-subtle': 'var(--colors-neutral-subtle)',
    'neutral-subtle-foreground': 'var(--colors-neutral-subtle-foreground)',
    'success-subtle': 'var(--colors-success-subtle)',
    'success-subtle-foreground': 'var(--colors-success-subtle-foreground)',
  })
  expect(Object.keys(theme.colors).filter((key) => /^(?:black|white|amber|blue|emerald|neutral|teal|red|zinc)(?:-\d+)?$|^badge-/.test(key))).toEqual(
    []
  )
})

it('uses typed theme references in styles while retaining valid native CSS tokens', () => {
  const root = resolve(import.meta.dirname, '../../../..')
  const tokens = new Set<string>(Object.values(theme).flatMap((value) => (typeof value === 'object' ? Object.values(value) : [])))
  const files = globSync(['apps/web/src/**/*.css{,.ts}', 'packages/design-system/{src,.storybook}/**/*.css{,.ts}'], { cwd: root })
  expect(files.length).toBeGreaterThan(0)

  for (const file of files) {
    const references = readFileSync(resolve(root, file), 'utf8').matchAll(
      /var\(--(?:animations|breakpoints|colors|easings|font-sizes|font-weights|fonts|letter-spacings|line-heights|radii|shadows)-[\w-]+/g
    )
    for (const [reference] of references) {
      expect(file.endsWith('.css'), `${file}: use theme instead of ${reference}`).toBe(true)
      expect(tokens.has(`${reference})`), `${file}: ${reference}`).toBe(true)
    }
  }
})
