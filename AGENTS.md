# Recipe Organizer

Full-stack recipe management app with a TanStack Router browser SPA and Hono API, deployed on Cloudflare Workers.

## Quick Reference

- **Toolchain:** Vite+ (`vp`) wrapping pnpm + Vite + Vitest + Oxlint + Oxfmt
- **Dev:** `pnpm dev` (runs Vite on 3000 and Wrangler on 8787 in parallel)
- **Build:** `pnpm build` (web assets, then the Worker bundle)
- **Test:** `vp test`
- **Check (fmt + lint + types):** `vp check`
- **Lint:** `vp lint`
- **Format:** `vp fmt`

See the Vite+ section below for the full command reference.

## Critical Rules

- **Always run `vp check` before committing.**
- **Route changes require regeneration:** restart `pnpm dev` after adding/moving routes.
- **Runtime boundary:** the browser SPA starts at `apps/web/index.html` and `apps/web/src/main.tsx`; the Worker entry is `apps/api/src/index.ts`'s default `fetch` export. Browser API calls use same-origin `/api/*` fetches.
- **UI components are owned:** `packages/design-system/src/ui/<category>/<component>/` holds each reusable component family and its colocated `*.stories.tsx` — edit them directly, don't re-pull from a registry. Import via `@recipe-organizer/design-system/<component>`; keep app dependencies out of the package. `knip` checks its exports. Follow `packages/design-system/styling.spec.md`: use minimal component-local `Pick` props, keep recipes private, and preserve Base UI `render` composition with actual router `Link` components. Parent wrappers own external layout.
- **Panda code generation:** `pnpm run styles:codegen` runs the root native `panda codegen` command. It generates `packages/design-system/styled-system/`, exposed as `@recipe-organizer/design-system/css` and `@recipe-organizer/design-system/tokens`. `prepare` and the web/Storybook dev and build commands invoke that root script before starting; PostCSS manages consumer CSS extraction and HMR.
- **Storybook:** `vp run storybook` (6006) / `vp run storybook:build`. Add or update the colocated stories when changing UI components; use the folder category as the Storybook title prefix (Actions, Data Display, Feedback, Forms, Layout, Navigation, Overlays).
- **DB migrations:** `pnpm db:migrate:local` (local D1) / `pnpm db:migrate:remote` (production D1).

## Guidelines

Canonical reference = the `*.spec.md` files under `docs/` + `docs/infrastructure/` and the per-feature specs
colocated with the code.

- [Project Structure](docs/file-structure.spec.md)
- [Design-system styling and ownership](packages/design-system/styling.spec.md)
- [Platform (Cloudflare Workers)](docs/infrastructure/server/platform.spec.md)
- [Data Layer (Drizzle + D1)](docs/infrastructure/server/data-layer.spec.md)
- [Hono API](docs/infrastructure/server/server-functions.spec.md)
- [Form Patterns](docs/infrastructure/client/forms.spec.md)
- [Client State Layering](docs/infrastructure/client/client-state.spec.md)
- [Routing & SPA](docs/infrastructure/client/routing-ssr.spec.md)
- [Auth (Better Auth)](docs/infrastructure/server/auth.spec.md)
- Per-feature specs: `apps/web/src/features/<name>/<name>.spec.md` (or `apps/web/src/features/<name>/spec/index.spec.md`)

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
