import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'react', 'unicorn'],
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
  ignorePatterns: [
    '**/*.js',
    '**/dist/**',
    '**/routeTree.gen.ts',
    '**/build/**',
    '**/.adonisjs/api.ts',
    '**/.adonisjs/prisma.ts',
    '**/.prisma/client/**',
    '**/*.d.ts',
  ],
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

    // Suspicious
    'react-in-jsx-scope': 'off',
    'no-unneeded-ternary': 'off',
    'style-prop-object': 'off',
    'no-unsafe-type-assertion': 'off',
    'react/jsx-no-constructed-context-values': 'off',

    // Pedantic
    'no-deprecated': 'error',

    // Style
    'prefer-template': 'error',
    'jsx-curly-brace-presence': 'error',
    'filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
        },
        ignore: '\\[.+\\]\\.tsx',
      },
    ],
    'prefer-default-export': 'off',
    'no-magic-numbers': 'off',
    'sort-imports': 'off',
    'sort-keys': 'off',
    'id-length': ['error', { exceptions: ['v', 'T'] }],
    'no-ternary': 'off',
    'no-duplicate-imports': 'off',
    'max-params': 'off',
    'jsx-max-depth': 'off',
    'jsx-props-no-spreading': 'off',
    'max-statements': 'off',
    'no-null': 'off',
  },
})
