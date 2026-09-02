import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

import { tanstackSerwistPlugin } from './scripts/generate-sw.ts'

const isTest = Boolean(process.env.VITEST)
const isAnalyze = Boolean(process.env.ANALYZE)

const viteConfig = defineConfig({
  devtools: {
    enabled: isAnalyze,
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    plugins: ['typescript', 'react', 'unicorn', 'import'],
    jsPlugins: [{ name: 'recipe-oranizer', specifier: './oxlint/index.ts' }],
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
    ignorePatterns: ['**/routeTree.gen.ts', 'vite.config.ts'],
    overrides: [
      {
        files: ['**/use-file-upload.ts'],
        rules: {
          'react-hooks/exhaustive-deps': 'off',
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
      'id-length': ['error', { exceptions: ['v', 'x', '$'] }],
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
    experimentalTailwindcss: {
      stylesheet: 'src/styles/app.css',
    },
    ignorePatterns: ['src/routeTree.gen.ts'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              test: /node_modules\/react/,
              name: 'react',
            },
            {
              test: /node_modules\/react-dom/,
              name: 'react-dom',
            },
            {
              test: /node_modules\/@tanstack\/react-query/,
              name: 'tanstack-query',
            },
          ],
        },
      },
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
    devtools({
      injectSource: { enabled: false },
    }),
    tanstackStart(),
    react({ compiler: true }),
    ...(isTest ? [] : [cloudflare({ viteEnvironment: { name: 'ssr' } })]),
    tailwindcss(),
    tanstackSerwistPlugin(),
  ],
  server: {
    port: 3000,
  },
  test: {
    include: ['src/**/*.test.ts', 'oxlint/**/*.test.ts'],
    globals: true,
  },
})

export default viteConfig
