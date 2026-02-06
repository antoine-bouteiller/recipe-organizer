# Code Quality

## DRY Principles

**Always prefer code factorization over duplication.**

- **No code duplication**: Extract shared code into utilities, hooks, or components
- **Centralize utilities**: `src/lib/utils.ts` or feature-specific utility files
- **Reuse components**: Extract patterns into `src/components/`
- **Share types**: Define once in `src/types/` or co-located, import elsewhere
- **Extract hooks**: Shared logic goes in `src/hooks/`

**Before adding code, check if:**

1. A similar function/component already exists
2. The code appears elsewhere and should be extracted
3. A utility would make it more maintainable

## Linting Rules (oxlint)

Configured in `.oxlintrc.json`:

| Rule                   | Enforcement                      |
| ---------------------- | -------------------------------- |
| No `console`           | Use proper logging               |
| No `any` types         | Strict typing required           |
| No non-null assertions | Handle nulls properly            |
| No unused code         | Variables, imports, params       |
| Arrow functions        | Prefer over function expressions |
| `for-of`               | Instead of `Array.forEach`       |
| Template literals      | Over string concatenation        |
| Import/export type     | Use `import type`, `export type` |
| Prefer `as const`      | For literal types                |
| Filename convention    | **kebab-case only**              |
| Accessibility          | a11y rules enforced              |

## Shadcn/Coss UI

Documentation: [Coss UI](https://coss.com/ui/llms.txt)

Add components:

```bash
bunx shadcn@latest add @coss/<component-name>
```
