# Recipe Organizer

Create and organize recipes, manage ingredients, and generate shopping lists. Supports Google sign-in, desktop and mobile layouts, and PWA installation (requires connectivity).

Built with a Svelte 5 SPA over the Void API, TanStack Svelte Query, and Drizzle on Cloudflare Workers, with D1 for data and R2 for images.

## Get started

Install [Vite+](https://viteplus.dev/) and have Google OAuth credentials ready. Run commands from the repository root.

```bash
vp install
```

Create `.env` (Void's project-root environment file):

```dotenv
BETTER_AUTH_SECRET=your_local_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
pnpm db:migrate:local
pnpm dev
```

Open http://localhost:3000. One Vite server serves the static SPA shell and `/api/*` from the same origin; local data is stored in `.wrangler/state`.

## Commands

```bash
vp check               # Formatting, linting, and type checks
vp run check:svelte    # Svelte type checks (svelte-check)
vp test                # Tests
vp run storybook       # Component explorer on port 6006
pnpm build             # Build the web app and Worker
pnpm serve             # Preview the Void build
pnpm db:migrate:local  # Apply local database migrations
```

## Project layout

- `index.html`, `src/main.ts`, `src/app.svelte` — Static document shell and Svelte query-provider mount
- `src/pages/` — Client screens registered in `src/lib/client/router/routes.ts`
- `src/features/<feature>/` — `client/` components, hooks and `api/` query/mutation options, `server/` domain helpers, and shared schemas at the root
- `src/lib/` — `client/` router, query client/keys, form state and browser services; `server/` auth, D1, R2, and errors
- `src/db/` — Drizzle schema and migrations
- `src/components/ui/` — Owned UI components and Storybook stories
- `src/styles/` — Theme, global styles, and fonts
- `src/` — App shell, hooks, browser-local stores, and shared utils
- `routes/api/`, `middleware/` — Void HTTP adapters and request lifecycle
- `void.config.ts`, `vite.config.ts` — Application runtime and build configuration
- `tools/` — Custom Oxlint rules, scripts, and tooling-only Wrangler config

See the [project structure](docs/file-structure.spec.md) and [styling guidelines](src/styles/styling.spec.md) for details.

Every document URL receives the same static SPA shell; there is no SSR. The in-house Navigation API
router preloads screen code and query data before committing. Server records live in a document-local
query cache (fresh for 5 minutes, retained unused for 24 hours); API mutations invalidate affected keys.
Client guards choose screens, while the API authorizes protected reads and writes. Unknown document
URLs render in-app NotFound with HTTP 200; missing recipes return API 404 with in-page recovery.
Local development always supplies an active admin identity, so it does not exercise Google sign-in.

## Deploy

Requires a Cloudflare account with D1 and R2 configured in [`void.config.ts`](void.config.ts), plus `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, and production authentication secrets. Keep tooling resource IDs in
`tools/wrangler.jsonc` synchronized with Void config.

```bash
pnpm deploy
```

Void builds and deploys the Worker and web assets together. `pnpm build` outputs
`dist/client` and `dist/ssr`; the latter is the API/middleware Worker bundle, not server page rendering.
CI deploys with `vp exec void deploy --platform cloudflare` and then runs the
Drizzle-kit database migration step. Authentication secrets (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`) remain dashboard-managed,
preserved by `keep_vars`. See the [platform](docs/infrastructure/server/platform.spec.md) and [authentication](docs/infrastructure/server/auth.spec.md) docs for configuration.
