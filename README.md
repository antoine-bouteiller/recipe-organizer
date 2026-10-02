# Recipe Organizer

Create and organize recipes, manage ingredients, and generate shopping lists. Supports Google sign-in, desktop and mobile layouts, and PWA installation (requires connectivity).

Built with React, TanStack Router, Void, and Drizzle on Cloudflare Workers, with D1 for data and R2 for images.

## Get started

Install [Vite+](https://viteplus.dev/) and have Google OAuth credentials ready. Run commands from the repository root.

```bash
vp install
```

Create `apps/web/.env` (Void's project-root environment file):

```dotenv
SESSION_SECRET=your_local_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_PUBLIC_URL=http://localhost:3000
```

```bash
pnpm db:migrate:local
pnpm dev
```

Open http://localhost:3000. One Vite server serves the SPA and `/api/*` from the same origin; local data is stored in `apps/web/.wrangler/state`.

## Commands

```bash
vp check               # Formatting, linting, and type checks
vp test                # Tests
vp run storybook       # Component explorer on port 6006
pnpm build             # Build the web app and Worker
pnpm serve             # Preview the Void build
pnpm db:migrate:local  # Apply local database migrations
```

## Project layout

- `apps/web` — React browser app (`src/`), Void API file routes (`routes/`) and middleware, Worker configuration, and server code (`server/`: helpers, database schema, Drizzle migrations)
- `packages/design-system` — Shared UI, styles, and Storybook stories
- Other `packages/*` — Shared logic, configuration, and tooling

See the [project structure](docs/file-structure.spec.md) and [design-system guidelines](packages/design-system/styling.spec.md) for details.

## Deploy

Requires a Cloudflare account with D1 and R2 configured in [`apps/web/void.config.ts`](apps/web/void.config.ts), plus `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, and production authentication secrets. Keep tooling resource IDs in
`apps/web/server/wrangler.jsonc` synchronized with Void config.

```bash
VITE_PUBLIC_URL=https://recipes.example.com pnpm deploy
```

Void builds and deploys the Worker and web assets together. `pnpm build` outputs
`apps/web/dist/client` and `apps/web/dist/ssr`; the latter is the Worker bundle, not page SSR.
CI deploys with `vp -C apps/web exec void deploy --platform cloudflare` and then runs the
Drizzle-kit database migration step. Authentication secrets (`SESSION_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`) and the runtime `VITE_PUBLIC_URL` Worker variable remain dashboard-managed,
preserved by `keep_vars`. See the [platform](docs/infrastructure/server/platform.spec.md) and [authentication](docs/infrastructure/server/auth.spec.md) docs for configuration.
