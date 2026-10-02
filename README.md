# Recipe Organizer

Create and organize recipes, manage ingredients, and generate shopping lists. Supports Google sign-in, desktop and mobile layouts, and PWA installation (requires connectivity).

Built with React, Void Pages with islands, and Drizzle on Cloudflare Workers, with D1 for data and R2 for images.

## Get started

Install [Vite+](https://viteplus.dev/) and have Google OAuth credentials ready. Run commands from the repository root.

```bash
vp install
```

Create `.env` (Void's project-root environment file):

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

Open http://localhost:3000. One Vite server serves server-rendered pages and `/api/*` from the same origin; local data is stored in `.wrangler/state`.

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

- `pages/` — Void page components, layouts, loaders, actions, and island wrappers
- `src/features/<feature>/` — `client/` components and hooks, `server/` domain helpers, and shared schemas at the root
- `src/lib/` — `client/` browser services and `server/` auth, D1, R2, and errors
- `src/db/` — Drizzle schema and migrations
- `src/components/ui/` — Owned UI components and Storybook stories
- `src/styles/` — Theme, global styles, and fonts
- `src/` — App shell, hooks, browser-local stores, and shared utils
- `routes/api/`, `middleware/` — Void HTTP adapters and request lifecycle
- `void.config.ts`, `vite.config.ts` — Application runtime and build configuration
- `tools/` — Custom Oxlint rules, scripts, and tooling-only Wrangler config

See the [project structure](docs/file-structure.spec.md) and [styling guidelines](src/styles/styling.spec.md) for details.

Home, search, shopping list, and recipe details are island pages: the document is server-rendered and
only interactive controls hydrate. Login, settings, and recipe editors are regular hydrated pages.
Loaders read server helpers directly; page actions handle writes and refresh props in place.
Unknown URLs return Void's default 404; missing recipes show in-page recovery.
Local development always supplies an active admin identity, so it does not exercise Google sign-in.

## Deploy

Requires a Cloudflare account with D1 and R2 configured in [`void.config.ts`](void.config.ts), plus `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, and production authentication secrets. Keep tooling resource IDs in
`tools/wrangler.jsonc` synchronized with Void config.

```bash
VITE_PUBLIC_URL=https://recipes.example.com pnpm deploy
```

Void builds and deploys the Worker and web assets together. `pnpm build` outputs
`dist/client` and `dist/ssr`; the latter is the Worker bundle, including page rendering.
CI deploys with `vp exec void deploy --platform cloudflare` and then runs the
Drizzle-kit database migration step. Authentication secrets (`SESSION_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`) and the runtime `VITE_PUBLIC_URL` Worker variable remain dashboard-managed,
preserved by `keep_vars`. See the [platform](docs/infrastructure/server/platform.spec.md) and [authentication](docs/infrastructure/server/auth.spec.md) docs for configuration.
