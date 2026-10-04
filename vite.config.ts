import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { voidReact } from '@void/react/plugin'
import type { Plugin, UserConfig } from 'vite-plus'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'
import { voidPlugin } from 'void'

const features = ['auth', 'ingredients', 'recipe', 'search', 'settings', 'shopping-list', 'users']
const restrictedReactImports = {
  importNames: ['useMemo', 'useCallback'],
  message: 'Rely on React Compiler instead of manual memoization with useMemo or useCallback.',
  name: 'react',
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

// @void/react sets its browser entries as top-level inputs, which every environment inherits.
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

const viteConfig = defineConfig(({ isPreview }) => ({
  build: { minify: true },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          // Void links CSS per JS chunk; one shared style chunk yields one stylesheet instead of one per component.
          output: { codeSplitting: { groups: [{ name: 'styles', test: /\.css(?:\.ts)?(?:$|\?)|\.vanilla\.css/ }] } },
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
    jsPlugins: [{ name: 'recipe-oranizer', specifier: './tools/oxlint/index.ts' }],
    options: { reportUnusedDisableDirectives: 'error', typeAware: true, typeCheck: true },
    overrides: [
      ...((): NonNullable<NonNullable<UserConfig['lint']>['overrides']> => {
        const parentRestriction = {
          message: 'Imports must not traverse more than one parent directory. Use an alias instead.',
          regex: '^\\.\\./\\.\\.(/|$)',
        }
        const svelteReactRestriction = {
          group: ['react', 'react/*', 'react-dom', 'react-dom/*', '@void/react', '@void/react/*'],
          message: 'Svelte components and rune modules must not import React runtime or adapter APIs.',
        }
        return [
          {
            files: ['**/*.svelte', '**/*.svelte.ts'],
            rules: {
              'no-restricted-imports': ['error', { patterns: [parentRestriction, svelteReactRestriction] }],
              // Transitional: React Compiler rules still protect React files until cut-over.
              'react/capitalized-calls': 'off',
              'react/error-boundaries': 'off',
              'react/globals': 'off',
              'react/hooks': 'off',
              'react/immutability': 'off',
              'react/incompatible-library': 'off',
              'react/invariant': 'off',
              'react/preserve-manual-memoization': 'off',
              'react/purity': 'off',
              'react/refs': 'off',
              'react/rule-suppression': 'off',
              'react/set-state-in-effect': 'off',
              'react/set-state-in-render': 'off',
              'react/static-components': 'off',
              'react/syntax': 'off',
              'react/todo': 'off',
              'react/unsupported-syntax': 'off',
              'react/use-memo': 'off',
              'react/void-use-memo': 'off',
            },
          },
          ...features.flatMap((feature): NonNullable<NonNullable<UserConfig['lint']>['overrides']> => {
            const patterns = [
              parentRestriction,
              ...features
                .filter((other) => other !== feature)
                .map((other) => ({
                  group: [`@/features/${other}/client/**`, `@/features/${other}/server/**`, `../**/${other}/client/**`, `../**/${other}/server/**`],
                  message: 'Features may only import the shared root modules of other features. Compose them in routes or app-owned components.',
                })),
            ]
            return [
              {
                files: [`src/features/${feature}/**/*.{ts,tsx,svelte}`],
                rules: {
                  'no-restricted-imports': ['error', { paths: [restrictedReactImports], patterns }],
                },
              },
              {
                // Matching overrides replace no-restricted-imports options, so keep both guards.
                files: [`src/features/${feature}/**/*.svelte`, `src/features/${feature}/**/*.svelte.ts`],
                rules: {
                  'no-restricted-imports': ['error', { patterns: [...patterns, svelteReactRestriction] }],
                },
              },
            ]
          }),
        ]
      })(),
      {
        files: ['**/use-file-upload.ts'],
        rules: {
          'react-hooks/exhaustive-deps': 'off',
        },
      },
      {
        // CSS declaration and selector order determines the cascade.
        files: ['**/*.css.ts'],
        rules: {
          'sort-keys': 'off',
        },
      },
      {
        // Numeric token scales are intentionally ordered by value.
        files: ['src/styles/theme/**/*.ts'],
        rules: {
          'sort-keys': 'off',
        },
      },
    ],
    plugins: ['typescript', 'react', 'unicorn', 'import'],
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
      'function-component-definition': 'off', // Conflicts with func-style
      'group-exports': 'off',
      'id-length': ['error', { exceptions: ['z', 'x', '$'] }],
      'jsx-max-depth': 'off',
      'jsx-props-no-spreading': 'off',
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
      'no-restricted-imports': [
        'error',
        {
          paths: [restrictedReactImports],
          patterns: [
            {
              message: 'Imports must not traverse more than one parent directory. Use an alias instead.',
              regex: '^\\.\\./\\.\\.(/|$)',
            },
          ],
        },
      ],
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
      'react-in-jsx-scope': 'off',
      'react/capitalized-calls': 'error',
      'react/error-boundaries': 'error',
      'react/globals': 'error',
      'react/hooks': 'error',
      'react/immutability': 'error',
      'react/incompatible-library': 'error',
      'react/invariant': 'error',
      'react/jsx-no-constructed-context-values': 'off',
      'react/preserve-manual-memoization': 'error',
      'react/purity': 'error',
      'react/refs': 'error',
      'react/rule-suppression': 'error',
      'react/set-state-in-effect': 'error',
      'react/set-state-in-render': 'error',
      'react/static-components': 'error',
      'react/syntax': 'error',
      'react/todo': 'error',
      'react/unsupported-syntax': 'error',
      'react/use-memo': 'error',
      'react/void-use-memo': 'error',
      'recipe-oranizer/no-conditional-empty-object-spread': 'error',
      'recipe-oranizer/no-known-value-widening': 'error',
      'recipe-oranizer/no-low-signal-symbol-names': 'error',
      'recipe-oranizer/no-module-mocking': 'error',
      'recipe-oranizer/no-object-parameters': 'error',
      'recipe-oranizer/no-unknown-type-aliases': 'error',
      'recipe-oranizer/no-unsafe-dictionary-type': 'error',
      'recipe-oranizer/no-use-shared-destructuring': 'error',
      'recipe-oranizer/vanilla-extract-theme-tokens': 'error',
      'sort-imports': 'off',
      'style-prop-object': 'off',
    },
  },
  plugins: [
    vanillaExtractPlugin(),
    // Vitest cannot run the Worker environment.
    // Vanilla Extract reloads this file mid-build without `isPreview`; voidPlugin() would then rewrite .void/entry.ts without deploy-only options.
    ...(!process.env.VITEST && isPreview !== undefined
      ? [
          voidPlugin({ persistTo: '.wrangler/state' }),
          voidReact({ prefetch: { cacheFor: ['30s', '1h'] }, react: { compiler: true }, viewTransitions: true }),
          betterAuthMinimal,
          clientOnlyEntries,
        ]
      : // The app adapter bundles its own Svelte plugin; tests and Storybook need a standalone one.
        [svelte()]),
  ],
  resolve: {
    // Virtual island entries and Svelte files are outside tsconfig path resolution.
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL('src/', import.meta.url)) },
      { find: /^@storybook-helpers\//, replacement: fileURLToPath(new URL('.storybook/', import.meta.url)) },
    ],
    tsconfigPaths: true,
  },
  server: { port: 3000 },
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    coverage: {
      exclude: ['**/*.stories.{tsx,svelte}', '**/*.css.ts'],
      include: ['src/**/*.{ts,tsx,svelte}', 'pages/**/*.{ts,tsx,svelte}', 'tools/oxlint/rules/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
    projects: [
      { extends: true, test: { globals: true, name: 'unit' } },
      {
        extends: true,
        optimizeDeps: { include: ['@vanilla-extract/recipes/createRuntimeFn'] },
        plugins: [storybookTest({ configDir: '.storybook' })],
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
}))

export default viteConfig
