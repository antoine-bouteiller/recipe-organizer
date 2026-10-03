import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { voidReact } from '@void/react/plugin'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'
import { voidPlugin } from 'void'

const features = ['auth', 'ingredients', 'recipe', 'search', 'settings', 'shopping-list', 'users']
const restrictedReactImports = {
  name: 'react',
  importNames: ['useMemo', 'useCallback'],
  message: 'Rely on React Compiler instead of manual memoization with useMemo or useCallback.',
}

const viteConfig = defineConfig(({ isPreview }) => ({
  plugins: [
    vanillaExtractPlugin(),
    // Vitest cannot run the Worker environment.
    // Vanilla Extract reloads this file mid-build without `isPreview`; voidPlugin() would then rewrite .void/entry.ts without deploy-only options.
    ...(!process.env.VITEST && isPreview !== undefined
      ? [
          voidPlugin({ persistTo: '.wrangler/state' }),
          voidReact({ prefetch: { cacheFor: ['30s', '1h'] }, react: { compiler: true }, viewTransitions: true }),
        ]
      : []),
  ],
  server: { port: 3000 },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          // Void links CSS per JS chunk; one shared style chunk yields one stylesheet instead of one per component.
          output: { codeSplitting: { groups: [{ name: 'styles', test: /\.css(\.ts)?($|\?)|\.vanilla\.css/ }] } },
        },
      },
    },
  },
  lint: {
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: 'error' },
    plugins: ['typescript', 'react', 'unicorn', 'import'],
    jsPlugins: [{ name: 'recipe-oranizer', specifier: './tools/oxlint/index.ts' }],
    categories: {
      correctness: 'error',
      suspicious: 'error',
      perf: 'error',
      style: 'error',
    },
    env: {
      builtin: true,
      browser: true,
      commonjs: true,
      node: true,
      'shared-node-browser': true,
    },
    ignorePatterns: ['vite.config.ts'],
    overrides: [
      ...features.map((feature) => ({
        files: [`src/features/${feature}/**/*.{ts,tsx}`],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              paths: [restrictedReactImports],
              patterns: [
                {
                  regex: '^\\.\\./\\.\\.(/|$)',
                  message: 'Imports must not traverse more than one parent directory. Use an alias instead.',
                },
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
    rules: {
      // Restriction
      'no-restricted-imports': [
        'error',
        {
          paths: [restrictedReactImports],
          patterns: [
            {
              regex: '^\\.\\./\\.\\.(/|$)',
              message: 'Imports must not traverse more than one parent directory. Use an alias instead.',
            },
          ],
        },
      ],
      'default-case': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-console': 'error',
      'no-unused-vars': 'error',
      'no-unused-expressions': 'error',
      'no-explicit-any': 'error',
      'no-non-null-assertion': 'error',
      'no-array-for-each': 'error',
      'prefer-modern-math-apis': 'error',
      'prefer-number-properties': 'error',
      complexity: ['error', 15],

      // Suspicious
      'react-in-jsx-scope': 'off',
      'no-unneeded-ternary': 'off',
      'style-prop-object': 'off',
      'react/jsx-no-constructed-context-values': 'off',

      // Pedantic
      'no-deprecated': 'error',
      'no-negated-condition': 'error',
      'prefer-string-replace-all': 'error',

      // Suspicious
      'no-unassigned-import': 'off',

      // Style
      'filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
      'prefer-default-export': 'off',
      'no-magic-numbers': 'off',
      'sort-imports': 'off',
      'one-var': 'off',
      'no-namespace': 'off',
      'id-length': ['error', { exceptions: ['z', 'x', '$'] }],
      'no-ternary': 'off',
      'max-params': 'off',
      'jsx-max-depth': 'off',
      'jsx-props-no-spreading': 'off',
      'max-statements': 'off',
      'no-null': 'off',
      'no-nodejs-modules': 'off',
      'no-named-export': 'off',
      'group-exports': 'off',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'exports-last': 'off',
      'no-underscore-dangle': 'off',
      'max-nested-calls': 'off',
      'function-component-definition': 'off', // conflict with func-style

      // nusery
      'react/capitalized-calls': 'error',
      'react/error-boundaries': 'error',
      'react/globals': 'error',
      'react/hooks': 'error',
      'react/immutability': 'error',
      'react/incompatible-library': 'error',
      'react/invariant': 'error',
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
      'recipe-oranizer/vanilla-extract-theme-tokens': 'error',
    },
  },
  fmt: {
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
    printWidth: 150,
    experimentalSortImports: {},
  },
  staged: {
    '*': 'vp check --fix',
  },
  resolve: {
    // Virtual island entries sit outside the tsconfig project, so tsconfig paths don't resolve their imports.
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL('src/', import.meta.url)) }],
    tsconfigPaths: true,
  },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', globals: true } },
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        optimizeDeps: { include: ['@vanilla-extract/recipes/createRuntimeFn'] },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}', 'pages/**/*.{ts,tsx}', 'tools/oxlint/rules/**/*.ts'],
      exclude: ['**/*.stories.tsx', '**/*.css.ts'],
    },
  },
}))

export default viteConfig
