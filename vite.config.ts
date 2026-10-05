import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { voidSvelte } from '@void/svelte/plugin'
import type { Plugin, UserConfig } from 'vite-plus'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'
import { voidPlugin } from 'void'

const features = ['auth', 'ingredients', 'recipe', 'search', 'settings', 'shopping-list', 'users']
const parentRestriction = {
  message: 'Imports must not traverse more than one parent directory. Use an alias instead.',
  regex: '^\\.\\./\\.\\.(/|$)',
}
const reactRestriction = {
  group: ['react', 'react/*', 'react-dom', 'react-dom/*', '@void/react', '@void/react/*'],
  message: 'The application runs on Svelte; do not import React runtime or adapter APIs.',
}

// Void's auth runtime passes its generated Drizzle adapter, so Better Auth's Kysely mode is dead weight in the Worker.
const betterAuthMinimal: Plugin = {
  apply: 'build',
  enforce: 'pre',
  name: 'better-auth-minimal',
  resolveId(source, importer) {
    if (source === 'better-auth' && importer?.includes('/void/dist/')) {
      return this.resolve('better-auth/minimal', importer, { skipSelf: true })
    }
    return null
  },
}

// The Void page adapter sets its browser entries as top-level inputs, which every environment inherits.
const browserEntries = ['pages-client', 'islands-client']
const clientOnlyEntries: Plugin = {
  apply: 'build',
  configEnvironment(name, config) {
    const input = config.build?.rolldownOptions?.input
    if (name === 'client' || !input || typeof input !== 'object' || Array.isArray(input)) {
      return
    }
    for (const entry of browserEntries) {
      delete input[entry]
    }
  },
  enforce: 'post',
  name: 'client-only-entries',
}

const viteConfig = defineConfig({
  build: { minify: true },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          // Void links CSS per JS chunk; one shared style chunk yields one stylesheet instead of one per component.
          output: {
            codeSplitting: {
              groups: [
                { name: 'styles', test: /\.css(?:$|\?)/ },
                // Void only modulepreloads the pages-client graph, so each extra layout/page chunk adds a request round trip.
                { name: 'vendor', test: /node_modules[\\/]|preload-helper/ },
                // 3 keeps pair-only code (the recipe form shared by new and edit) out of every page's first load.
                { minShareCount: 3, name: 'shared' },
                // Rolldown has no minimum chunk size; this folds tiny pair-shared modules into one chunk instead.
                { maxModuleSize: 1024, minShareCount: 2, name: 'shared' },
              ],
            },
          },
        },
      },
    },
  },
  fmt: {
    experimentalSortImports: {},
    printWidth: 150,
    semi: false,
    singleQuote: true,
    svelte: true,
    trailingComma: 'es5',
  },
  lint: {
    categories: {
      correctness: 'error',
      perf: 'error',
      style: 'error',
      suspicious: 'error',
    },
    env: {
      browser: true,
      builtin: true,
      commonjs: true,
      node: true,
      'shared-node-browser': true,
    },
    jsPlugins: [
      { name: 'recipe-oranizer', specifier: './tools/oxlint/index.ts' },
      { name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
    ],
    options: { reportUnusedDisableDirectives: 'error', typeAware: true, typeCheck: true },
    overrides: features.map((feature): NonNullable<NonNullable<UserConfig['lint']>['overrides']>[number] => ({
      files: [`src/features/${feature}/**/*.{ts,svelte}`],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              parentRestriction,
              reactRestriction,
              ...features
                .filter((other) => other !== feature)
                .map((other) => ({
                  group: [`@/features/${other}/client/**`, `@/features/${other}/server/**`, `../**/${other}/client/**`, `../**/${other}/server/**`],
                  message: 'Features may only import the shared root modules of other features. Compose them in routes or app-owned components.',
                })),
            ],
          },
        ],
      },
    })),
    plugins: ['typescript', 'unicorn', 'import'],
    rules: {
      complexity: ['error', 15],
      'default-case': 'error',
      'exports-last': 'off',
      'filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
      'group-exports': 'off',
      'id-length': ['error', { exceptions: ['z', 'x', '$'] }],
      'max-nested-calls': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'no-array-for-each': 'error',
      'no-console': 'error',
      'no-deprecated': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-explicit-any': 'error',
      'no-magic-numbers': 'off',
      'no-named-export': 'off',
      'no-namespace': 'off',
      'no-negated-condition': 'error',
      'no-nodejs-modules': 'off',
      'no-non-null-assertion': 'error',
      'no-null': 'off',
      'no-restricted-imports': ['error', { patterns: [parentRestriction, reactRestriction] }],
      'no-ternary': 'off',
      'no-unassigned-import': 'off',
      'no-underscore-dangle': 'off',
      'no-unneeded-ternary': 'off',
      'no-unused-expressions': 'error',
      'no-unused-vars': 'error',
      'one-var': 'off',
      'prefer-default-export': 'off',
      'prefer-modern-math-apis': 'error',
      'prefer-number-properties': 'error',
      'prefer-string-replace-all': 'error',
      'recipe-oranizer/no-conditional-empty-object-spread': 'error',
      'recipe-oranizer/no-known-value-widening': 'error',
      'recipe-oranizer/no-low-signal-symbol-names': 'error',
      'recipe-oranizer/no-module-mocking': 'error',
      'recipe-oranizer/no-object-parameters': 'error',
      'recipe-oranizer/no-unknown-type-aliases': 'error',
      'recipe-oranizer/no-unsafe-dictionary-type': 'error',
      'recipe-oranizer/no-use-shared-destructuring': 'error',
      'sort-imports': 'off',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
  },
  // Vitest cannot run the Worker environment.
  plugins: process.env.VITEST
    ? [svelte()]
    : [
        voidPlugin({ persistTo: '.wrangler/state' }),
        voidSvelte({ prefetch: { cacheFor: ['30s', '1h'] }, viewTransitions: true }),
        betterAuthMinimal,
        clientOnlyEntries,
      ],
  resolve: {
    // Virtual island entries and Svelte files are outside tsconfig path resolution.
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL('src/', import.meta.url)) },
      {
        find: /^@storybook-helpers\//,
        replacement: fileURLToPath(new URL('.storybook/', import.meta.url)),
      },
    ],
    tsconfigPaths: true,
  },
  server: { port: 3000 },
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    coverage: {
      exclude: ['**/*.stories.svelte'],
      include: ['src/**/*.{ts,svelte}', 'pages/**/*.{ts,svelte}', 'tools/oxlint/rules/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
    projects: [
      { extends: true, test: { globals: true, name: 'unit' } },
      {
        extends: true,
        // Play functions assume the mobile layout unless a story pins its own viewport.
        plugins: [storybookTest({ configDir: '.storybook', initialGlobals: { viewport: { isRotated: false, value: 'mobile2' } } })],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
          },
          name: 'storybook',
        },
      },
    ],
  },
})

export default viteConfig
