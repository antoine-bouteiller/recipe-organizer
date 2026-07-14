import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import Icons from 'unplugin-icons/vite'
import solid from 'vite-plugin-solid'
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
    plugins: ['typescript', 'unicorn', 'import'],
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
      'no-unneeded-ternary': 'off',
      'style-prop-object': 'off',
      'no-unsafe-type-assertion': 'off',

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
      'no-namespace': 'off',
      'id-length': ['error', { exceptions: ['v', 'x', '$', 'T', 'X'] }],
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
              test: /node_modules\/solid-js/,
              name: 'solid',
            },
            {
              test: /node_modules\/@tanstack\/solid-query/,
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
    Icons({ compiler: 'solid' }),
    tanstackStart(),
    solid({ ssr: true }),
    ...(isTest ? [] : [cloudflare({ viteEnvironment: { name: 'ssr' } })]),
    tailwindcss(),
    tanstackSerwistPlugin(),
    devtools({
      injectSource: { enabled: false },
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    include: ['src/**/*.test.ts'],
    server: {
      deps: {
        inline: [/@tanstack\/solid-/, /@kobalte/, /@corvu/],
      },
    },
  },
})

export default viteConfig
