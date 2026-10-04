import type { KnipConfig } from 'knip'
import { svelte2tsx } from 'svelte2tsx'

const config: KnipConfig = {
  // The default Svelte compiler only reads <script> blocks; svelte2tsx keeps template references and type-only imports.
  compilers: { svelte: (text: string, filename: string) => svelte2tsx(text, { filename, isTsFile: true, mode: 'ts' }).code },
  entry: [
    'public/sw.js!',
    '{src,tools}/**/*.test.{ts,tsx}',
    'pages/**/*.{ts,tsx,svelte}!',
    'routes/**/*.ts!',
    'middleware/**/*.ts!',
    'tools/oxlint/index.ts',
    'tools/scripts/apply-migration-local.ts',
    'void.config.ts',
    'auth.ts!',
    'env.ts!',
    // TODO: remove with the React cut-over; React stories and their helper stay compilable until ported.
    'src/**/*.stories.tsx',
    '.storybook/story-section.tsx',
  ],
  husky: {
    config: ['.vite-hooks/pre-commit', '.vite-hooks/commit-msg'],
  },
  // TODO: remove with the React cut-over; Svelte ports have no consumers until their callers are ported.
  ignore: [
    'src/**/*.svelte',
    'src/**/*.svelte.ts',
    'src/components/ui/data-display/icons/svelte.ts',
    'src/components/ui/data-display/icons/icon-types.ts',
  ],
  // TODO: drop `@void/svelte` with the React cut-over.
  ignoreDependencies: ['cloudflare', 'oxc-transform-react', '@typescript/native', '@void/svelte'],
  ignoreIssues: {
    'pages/**/*.{ts,tsx,svelte}': ['exports', 'types'],
    // TODO: remove with the React cut-over.
    'src/**/*.stories.tsx': ['exports'],
    'src/db/schema/auth.ts': ['exports'],
    'tools/oxlint/index.ts': ['exports'],
    '{routes,middleware}/**/*.ts': ['exports'],
    '{void.config,env,auth}.ts': ['exports'],
  },
  includeEntryExports: true,
  project: ['**/*.{ts,tsx,svelte}!', '!**/*.stories.*!', '!.storybook/**!', '!tools/**!'],
  tags: ['-lintignore'],
}

export default config
