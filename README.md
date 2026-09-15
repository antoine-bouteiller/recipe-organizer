# Recipe Organizer

A modern recipe management application with a TanStack Router browser SPA and a Hono API, deployed on Cloudflare Workers.

## Features

- **Recipe Management**: Create, edit, and organize your recipes with rich text descriptions and images
- **Ingredient Database**: Maintain a database of ingredients with customizable units and categories
- **Shopping List**: Generate shopping lists from selected recipes with automatic quantity calculations
- **Search & Filter**: Find recipes quickly with real-time search
- **Authentication**: Secure Google OAuth authentication via Better Auth
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Installable PWA**: Web manifest, icons, and a minimal registered service worker support Samsung PWA installation; the app requires connectivity

## Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Query, TanStack Form, TanStack Store
- **Application**: TanStack Router browser SPA (`apps/web/index.html` + `apps/web/src/main.tsx`), React Query
- **Backend**: Hono on a Cloudflare Worker (`/api/*`)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 for image storage
- **Styling**: Tailwind CSS v4, owned Base UI components in `@recipe-organizer/design-system`, Storybook
- **Authentication**: Better Auth with Google OAuth

## Getting Started

### Prerequisites

- [Vite+](https://viteplus.dev/) installed (uses the pinned pnpm version)
- Cloudflare account (for deployment)
- Google OAuth credentials (for authentication)

### Installation

```bash
# Install dependencies
vp install
```

### Environment Variables

Create a `.env` file with the following:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_PUBLIC_URL=http://localhost:3000
```

### Development

```bash
# Run Vite (3000) and Wrangler (8787) in parallel
pnpm dev

# Formatting, linting, and type checking
vp check

# Run tests
vp test
```

Vite proxies `/api/*` to Wrangler. Development needs no production build, and local D1/R2 data stays in the root `.wrangler/state`.

### Design system

Reusable controls, forms, rich-text editing, navigation, error screens, and layouts live in `packages/design-system/src/ui/<category>/<component>/`, with the implementation and its
`<component>.stories.tsx` together. Responsive desktop/drawer implementations stay in the same family folder.
Form contexts and the shared `useAppForm` registry move with their controls.
Supporting hooks live in `packages/design-system/src/hooks/`; shared icons live in `src/ui/data-display/icons/`.
Import components from `@recipe-organizer/design-system/button` (and equivalent component subpaths).
The app and Storybook share `@recipe-organizer/design-system/styles.css`, including theme tokens and fonts;
only app-global scrolling and navigation transitions remain in `apps/web/src/styles/app.css`.
Thin web adapters supply routing, menus, theme/back actions, footer selection, and error-detail visibility.

Folder categories match the Storybook sidebar: `actions`, `data-display`, `feedback`, `forms`,
`layout`, `navigation`, and `overlays`. Component imports remain independent of these physical folders.

```bash
vp run storybook        # Component explorer on port 6006; light/dark theme toolbar
vp run storybook:build  # Static output: packages/design-system/storybook-static
```

### Building

```bash
# Build apps/web/dist, then apps/api/dist
pnpm build

# Preview both built apps through Wrangler (port 8787)
pnpm serve
```

### Database Management

```bash
# Export local D1 data to database.sql
pnpm db:dump

# Import database.sql to local D1
pnpm db:import

# Generate Cloudflare types
pnpm cf-typegen
```

## Project Structure

```
apps/
├── web/             # Browser SPA, routes, UI, and static assets
└── api/             # Cloudflare Worker, Hono API, and db/ schema and migrations
packages/
├── config/          # Runtime-neutral TypeScript base configuration
├── design-system/   # Reusable UI, shared styles/fonts, and colocated Storybook stories
├── shared/          # Cross-runtime schemas, constants, units, and helpers
├── scripts/         # Local database migration command
└── oxlint/          # Custom lint plugin and its tests
```

The pnpm workspace shares root tooling and one Cloudflare deployment. Run commands from the repository root;
keep `.env` and local D1/R2 state there. Workspace packages consume shared TypeScript sources through workspace dependencies.
Each tsconfig extends `@recipe-organizer/config/tsconfig.base.json` and selects its own runtime libraries and types.
`apps/web/vite.config.ts` owns the SPA build; `apps/api/wrangler.jsonc` owns the Worker build and deployment. Generated Worker declarations live in `apps/api/worker-configuration.d.ts`;
the web app also consumes them through its API dependency for Hono RPC type checking.
Run package commands with `pnpm --filter @recipe-organizer/oxlint test` or `pnpm --filter @recipe-organizer/scripts check`.

## Contributing

This project uses:

- **Conventional Commits** for commit messages
- **Lefthook** for pre-commit hooks (linting, formatting, type checking)
- **oxlint** for fast, strict linting
- **Prettier** for code formatting

## Deployment

Configured for Cloudflare Workers with:

- `apps/api/src/index.ts` as the Worker entry, exporting `fetch`
- Static browser assets with SPA fallback; `/api` and `/api/*` run the Worker first
- D1 database binding
- R2 bucket for images
- Cloudflare Images integration

Run `pnpm build`, then `pnpm run deploy --var VITE_PUBLIC_URL:https://recipes.example.com` with your public URL.
Deployment uploads the prebuilt Worker and SPA assets together. CI supplies `VITE_PUBLIC_URL` for both the web build and the Worker runtime.
See `apps/api/wrangler.jsonc` for configuration details.

## Learn More

- [TanStack Router](https://tanstack.com/router)
- [Hono](https://hono.dev/)
- [TanStack Query](https://tanstack.com/query)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
