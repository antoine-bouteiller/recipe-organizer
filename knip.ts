import type { KnipConfig } from 'knip'
import { svelte2tsx } from 'svelte2tsx'

const config: KnipConfig = {
  // The default Svelte compiler only reads <script> blocks; svelte2tsx keeps template references and type-only imports.
  compilers: { svelte: (text: string, filename: string) => svelte2tsx(text, { filename, isTsFile: true, mode: 'ts' }).code },
  entry: [
    'public/sw.js!',
    'pages/**/*.{ts,svelte}!',
    'routes/**/*.ts!',
    'middleware/**/*.ts!',
    'tools/oxlint/index.ts',
    'tools/scripts/apply-migration-local.ts',
    'void.config.ts',
    'auth.ts!',
    'env.ts!',
  ],
  husky: {
    config: ['.vite-hooks/pre-commit', '.vite-hooks/commit-msg'],
  },
  ignoreDependencies: ['cloudflare', '@typescript/native'],
  ignoreIssues: {
    'pages/**/*.{ts,svelte}': ['exports', 'types'],
    // Svelte module scripts that only export snippet data still compile to an unused component default.
    'src/components/navigation/menu-items.svelte': ['exports'],
    'src/db/schema/auth.ts': ['exports'],
    'tools/oxlint/index.ts': ['exports'],
    '{routes,middleware}/**/*.ts': ['exports'],
    '{void.config,env,auth}.ts': ['exports'],
  },
  includeEntryExports: true,
  project: ['**/*.{ts,svelte}!', '!**/*.stories.*!', '!**/*.{example,story}.svelte!', '!.storybook/**!', '!tools/**!'],
  tags: ['-lintignore'],
}

export default config
