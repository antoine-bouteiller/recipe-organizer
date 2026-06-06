# Recipe Organizer

Full-stack recipe management app built with TanStack Start, deployed on Cloudflare Workers.

## Quick Reference

- **Toolchain:** Vite+ (`vp`) wrapping pnpm + Vite + Vitest + Oxlint + Oxfmt
- **Dev:** `pnpm dev` (sets `CLOUDFLARE_ENV=dev`, then runs `vp dev`)
- **Build:** `vp build`
- **Test:** `vp test`
- **Check (fmt + lint + types):** `vp check`
- **Lint:** `vp lint`
- **Format:** `vp fmt`

See the Vite+ section below for the full command reference.

## Critical Rules

- **Always run `vp check` before committing.**
- **Route changes require regeneration:** restart `pnpm dev` after adding/moving routes.
- **Add Shadcn components:** `vp dlx shadcn@latest add @coss/<component-name>`.
- **DB migrations:** `pnpm db:migrate:local` (local D1) / `pnpm db:migrate:remote` (production D1).

## Guidelines

Canonical reference = the `*.spec.md` files under `docs/` + `docs/infrastructure/` and the per-feature specs
colocated with the code.

- [Project Structure](docs/file-structure.spec.md)
- [Platform (Cloudflare Workers)](docs/infrastructure/platform.spec.md)
- [Data Layer (Drizzle + D1)](docs/infrastructure/data-layer.spec.md)
- [Server Functions](docs/infrastructure/server-functions.spec.md)
- [Form Patterns](docs/infrastructure/forms.spec.md)
- [Client State Layering](docs/infrastructure/client-state.spec.md)
- [Routing & SSR](docs/infrastructure/routing-ssr.spec.md)
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
