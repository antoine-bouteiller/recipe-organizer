import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

const features = ['auth', 'ingredients', 'recipe', 'search', 'settings', 'shopping-list', 'users']
const restrictedReactImports = {
  name: 'react',
  importNames: ['useMemo', 'useCallback'],
  message: 'Rely on React Compiler instead of manual memoization with useMemo or useCallback.',
}

const viteConfig = defineConfig({
  plugins: [vanillaExtractPlugin()],
  lint: {
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: 'error' },
    plugins: ['typescript', 'react', 'unicorn', 'import'],
    jsPlugins: [{ name: 'recipe-oranizer', specifier: '@recipe-organizer/oxlint' }],
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
    ignorePatterns: ['**/routeTree.gen.ts', 'apps/api/worker-configuration.d.ts', 'vite.config.ts'],
    overrides: [
      ...features.map((feature) => ({
        files: [`apps/web/src/features/${feature}/**/*.{ts,tsx}`],
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
                    group: [`@client/features/${other}`, `@client/features/${other}/**`, `../**/${other}`, `../**/${other}/**`],
                    message: 'Features must not import other features. Compose them in routes or app-owned components.',
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
        files: ['packages/design-system/src/theme/**/*.ts'],
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
    ignorePatterns: ['apps/web/src/routeTree.gen.ts'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    projects: [
      { extends: true, test: { name: 'unit' } },
      {
        extends: true,
        plugins: [storybookTest({ configDir: 'packages/design-system/.storybook' })],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}', 'packages/oxlint/rules/**/*.ts'],
      exclude: ['**/*.stories.tsx', '**/*.css.ts', '**/routeTree.gen.ts'],
    },
  },
})

export default viteConfig
