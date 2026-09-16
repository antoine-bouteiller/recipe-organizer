import { defineConfig } from 'vite-plus'

const viteConfig = defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
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
    ignorePatterns: ['**/routeTree.gen.ts', 'vite.config.ts', 'packages/design-system/styled-system/**'],
    overrides: [
      {
        files: ['**/use-file-upload.ts'],
        rules: {
          'react-hooks/exhaustive-deps': 'off',
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
      'consistent-type-specifier-style': ['error', 'prefer-inline'],
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
      'recipe-oranizer/no-module-mocking': 'error',
      'recipe-oranizer/no-object-parameters': 'error',
      'recipe-oranizer/no-shape-in-symbol-names': 'error',
      'recipe-oranizer/no-unknown-type-aliases': 'error',
      'recipe-oranizer/no-unsafe-dictionary-type': 'error',
    },
  },
  fmt: {
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
    printWidth: 150,
    experimentalSortImports: {},
    ignorePatterns: ['apps/web/src/routeTree.gen.ts', 'packages/design-system/styled-system/**'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
  },
})

export default viteConfig
