# Recipe Organizer

Full-stack recipe management app using server-rendered Void Pages with client navigation and a same-origin Void API, deployed on Cloudflare Workers.

## Quick Reference

- **Toolchain:** Vite+ (`vp`) wrapping pnpm + Vite + Vitest + Oxlint + Oxfmt
- **Dev:** `pnpm dev` (one Vite server on 3000 for rendered pages and the same-origin API)
- **Build:** `pnpm build` (Void builds `dist/client` assets and `dist/ssr` Worker bundle)
- **Test:** `vp test`
- **Check (fmt + lint + types):** `vp check`; Svelte components additionally need `vp run check:svelte` (`svelte-check --tsgo`)
- **Lint:** `vp lint`
- **Format:** `vp fmt`

See the Vite+ section below for the full command reference.

## Critical Rules

- **Always run `vp check` and `vp run check:svelte` before committing.**
- **Route changes require regeneration:** run `vp exec void prepare` after adding/moving Void pages or API routes to regenerate ignored route types before checks.
- **Runtime boundary:** Void generates the Worker entry from `pages/**`, `routes/api/**`, and global `middleware/**`. Feature code splits into `src/features/<feature>/{client,server}/` with isomorphic contracts at the feature root; `src/lib/` splits the same way. Page loaders read `@/features/<feature>/server/*` and `@/lib/server/*` directly; page actions own mutations. One root hydrated layout (`pages/layout.svelte`) wraps every page, with Void client navigation after SSR on first load. Each route is a folder with `index.svelte` and an optional `index.server.ts`; pages import components directly via `@/...`. Remaining browser API calls use typed `void/client` fetch through `readResponse`. Use `usePageAction()` for in-place prop refresh without changing URL/history; redirecting recipe deletion uses `submitAction` with `replace: true` instead. Callers await `usePageAction()` and own closing/navigation effects. The layout reads `useShared()`; its adapter mutates the returned object in place, so never destructure it (`recipe-oranizer/no-use-shared-destructuring`). Components are `.svelte` with typed `$props()` and `Snippet` children; rune modules are `*.svelte.ts`.
- **UI components are owned:** `src/components/ui/<category>/<component>/` holds each reusable component family and its colocated `*.stories.svelte` (Svelte CSF, with `*.example.svelte` story hosts) — edit them directly, don't re-pull from a registry. Import via `@/components/ui/<category>/<component>/<component>`; keep app dependencies out of `src/components/ui/`. Follow `src/styles/styling.spec.md`: use minimal component-local `Pick` props, keep recipes private, and compose overlay triggers through `renderTrigger` snippets; Button navigates with the actual `@void/svelte` `Link` via `asLink` + `href`. Parent wrappers own external layout.
- **Styling:** Vanilla Extract compiles owner-local `*.css.ts` files through the web and Storybook Vite plugins. Import typed shared values as `theme` from `@/styles/theme`, including in template interpolations; do not use shared raw `var(--…)` strings. Load `@/styles/global.css` for the global Vanilla Extract reset/base rules and theme. Native `@/styles/styles.css` retains font faces and layer order; safe-area insets use `theme.safeArea.top/bottom`; native CSS variables remain appropriate for component-owned and runtime-owned behavior. Keep component and app styles unlayered so they override the layered reset/base defaults.
- **Storybook:** `@storybook/svelte-vite`; `vp run storybook` (6006) / `vp run storybook:build`. Add or update colocated stories for changed interactions or new component presentations; styling-only changes can reuse existing stories for visual review. No router decorator is needed. Use the folder category as the Storybook title prefix (Actions, Data Display, Feedback, Forms, Layout, Navigation, Overlays).
- **Test boundaries:** `*.test.*` files test pure logic only; `*.stories.*` play functions test user interactions and their behavioral outcomes only. Do not assert design details in either: CSS classes, computed styles, colors, spacing, geometry, or animation properties. Review visual design in the browser instead.
- **Worker config and environment:** `void.config.ts` owns runtime/deploy bindings; `.env` is the local env file. `tools/wrangler.jsonc` is tooling-only; keep its resource IDs synchronized with `void.lock.json`. Auth uses `void/auth` configured by the root `auth.ts`; do not use `void/db` in app code or Void migrations. Drizzle-kit owns all migrations, including the auth tables, so keep `src/db/schema/{user,auth}.ts` in sync with the `auth.ts` field mappings. Auth secrets remain dashboard-managed through `keep_vars`.
- **DB migrations:** `pnpm db:migrate:local` (local D1) / `pnpm db:migrate:remote` (production D1).

## Guidelines

Canonical reference = the `*.spec.md` files under `docs/` + `docs/infrastructure/` and the per-feature specs
colocated with the code.

- [Project Structure](docs/file-structure.spec.md)
- [UI styling and ownership](src/styles/styling.spec.md)
- [Platform (Cloudflare Workers)](docs/infrastructure/server/platform.spec.md)
- [Data Layer (Drizzle + D1)](docs/infrastructure/server/data-layer.spec.md)
- [Void API](docs/infrastructure/server/server-functions.spec.md)
- [Form Patterns](docs/infrastructure/client/forms.spec.md)
- [Client State Layering](docs/infrastructure/client/client-state.spec.md)
- [Routing & SSR](docs/infrastructure/client/routing-ssr.spec.md)
- [Auth (Better Auth)](docs/infrastructure/server/auth.spec.md)
- Per-feature specs: `src/features/<name>/<name>.spec.md` (or `src/features/<name>/spec/index.spec.md`)

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!--injected-by-void-v0.22.0-->

## Void

- This project uses [Void](https://void.cloud), a full-stack Vite framework for Cloudflare Workers with file-based API routing, server-rendered pages, and typed backend services.
- Deploy to your Cloudflare account with `void deploy --platform cloudflare`, or connect to a Void platform with `void connect <url>` and deploy with `void deploy --platform void`. `void deploy` uses the saved destination.
- Use Void's CLI and typed APIs for development and infrastructure. Void infers Cloudflare bindings from your imports; use Void commands to manage them.
- Before working with Void, read the relevant Markdown docs in `node_modules/void/skills/void/docs/`. Start with `guide/quickstart.md` for setup and `reference/cli.md` for commands; consult the other guides and references for any Void feature.

<!--/injected-by-void-->
