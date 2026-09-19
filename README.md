# Recipe Organizer

Create and organize recipes, manage ingredients, and generate shopping lists. Supports Google sign-in, desktop and mobile layouts, and PWA installation (requires connectivity).

Built with React, TanStack Router, Hono, and Drizzle on Cloudflare Workers, with D1 for data and R2 for images.

## Get started

Install [Vite+](https://viteplus.dev/) and have Google OAuth credentials ready. Run commands from the repository root.

```bash
vp install
```

Create a root `.env` file:

```dotenv
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_PUBLIC_URL=http://localhost:3000
```

```bash
pnpm db:migrate:local
pnpm dev
```

Open http://localhost:3000. Vite proxies API requests to Wrangler on port 8787; local data is stored in `.wrangler/state`.

## Commands

```bash
vp check               # Formatting, linting, and type checks
vp test                # Tests
vp run storybook       # Component explorer on port 6006
pnpm build             # Build the web app and Worker
pnpm serve             # Preview the build on port 8787
pnpm db:migrate:local  # Apply local database migrations
```

## Project layout

- `apps/web` — React browser app
- `apps/api` — Hono API, database schema, and migrations
- `packages/design-system` — Shared UI, styles, and Storybook stories
- Other `packages/*` — Shared logic, configuration, and tooling

See the [project structure](docs/file-structure.spec.md) and [design-system guidelines](packages/design-system/styling.spec.md) for details.

## Deploy

Requires a Cloudflare account with D1 and R2 configured in [`apps/api/wrangler.jsonc`](apps/api/wrangler.jsonc), plus production authentication secrets.

```bash
VITE_PUBLIC_URL=https://recipes.example.com pnpm build
pnpm run deploy --var VITE_PUBLIC_URL:https://recipes.example.com
```

The Worker and web assets deploy together. See the [platform](docs/infrastructure/server/platform.spec.md) and [authentication](docs/infrastructure/server/auth.spec.md) docs for configuration.
