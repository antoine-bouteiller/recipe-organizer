import { RuleTester } from 'vite-plus/lint/plugins-dev'

import { noUseSharedDestructuringRule } from './no-use-shared-destructuring.ts'

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } })
const error = { messageId: 'sharedDestructuring' }

tester.run('VC-9/recipe-oranizer/no-use-shared-destructuring', noUseSharedDestructuringRule, {
  invalid: [
    { code: "import { useShared } from '@void/svelte'; const { pathname } = useShared();", errors: [error] },
    { code: "import { useShared } from '@void/svelte'; let { pathname: currentPath } = useShared();", errors: [error] },
    { code: "import { useShared as shared } from '@void/svelte'; const { pathname } = shared();", errors: [error] },
    { code: "import { useShared } from '@void/svelte'; let pathname; ({ pathname } = useShared());", errors: [error] },
    { code: "import { useShared as shared } from '@void/svelte'; let pathname; ({ pathname } = shared());", errors: [error] },
    { code: "import { useShared } from '@void/svelte'; const [pathname] = useShared();", errors: [error] },
    { code: "import { useShared } from '@void/svelte'; let pathname; [pathname] = useShared();", errors: [error] },
    { code: "import { useShared } from '@void/svelte'; const { context: { user }, ...rest } = useShared();", errors: [error] },
    { code: "import { useShared } from '@void/svelte'; function readPath() { const { pathname } = useShared(); }", errors: [error] },
    {
      code: "import { useShared as shared } from '@void/svelte'; function readPath() { const { pathname } = shared(); }",
      errors: [error],
    },
  ],
  valid: [
    "import { useShared } from '@void/svelte'; const shared = useShared(); shared.pathname;",
    "import { useShared as sharedContext } from '@void/svelte'; const shared = sharedContext(); shared.pathname;",
    'function useShared() { return { pathname: "/" }; } const { pathname } = useShared();',
    "import { useShared } from '@void/react'; const { pathname } = useShared();",
    "import { useShared as shared } from './context'; const { pathname } = shared();",
    "import { useShared } from '@void/svelte'; function readPath(useShared: () => { pathname: string }) { const { pathname } = useShared(); }",
    "import { useShared as shared } from '@void/svelte'; function readPath() { const shared = () => ({ pathname: '/' }); const { pathname } = shared(); }",
    "import { useShared } from '@void/svelte'; function readPath() { const shared = useShared(); return shared.pathname; }",
    "import { useShared } from '@void/svelte'; let shared; shared = useShared();",
    "import { useShared } from '@void/svelte'; const { pathname } = other(useShared());",
    "import { useShared } from '@void/svelte'; const { pathname } = useShared().context;",
    "import * as context from '@void/svelte'; const { pathname } = context.useShared();",
    "import type { useShared } from '@void/svelte'; const { pathname } = useShared();",
    "import { type useShared } from '@void/svelte'; const { pathname } = useShared();",
  ],
})
