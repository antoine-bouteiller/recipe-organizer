# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Organizer is a full-stack recipe management application built with TanStack Start (React SSR framework), deployed on Cloudflare Workers. The app manages recipes, ingredients, and shopping lists with authentication via Better Auth.

## Tech Stack

- **Frontend**: React 19, TanStack Router (file-based routing), TanStack Query, TanStack Form, TanStack Store
- **Backend**: TanStack Start (SSR), Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare R2 (object storage)
- **Database**: Drizzle ORM with D1 SQLite
- **Auth**: Google OAuth
- **Styling**: Tailwind CSS v4, Shadcn UI components (Base UI)
- **Linting/Formatting**: oxlint, oxfmt
- **Git Hooks**: Lefthook with commitlint (conventional commits)

## Package Manager

**IMPORTANT: This project uses Bun as the package manager.**

- **DO NOT use npm or yarn commands**
- **ALWAYS use `bun` commands** for all package management and script execution
- The lockfile is `bun.lock` (NOT `package-lock.json` or `yarn.lock`)
- If you need to install dependencies, use `bun install`
- To run scripts, use `bun <script-name>` (e.g., `bun dev`, `bun build`)

## Development Commands

```bash
# Development server (port 3000)
bun dev

# Build for production
bun run build

# Type checking
bun typecheck

# Linting (auto-fix)
bun lint

# Formatting
bun format

# Run tests
bun test
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── forms/       # Generic form field components (combobox, text, number, image, tiptap)
│   └── ui/          # Shadcn UI components
├── features/        # Feature-based organization
│   ├── auth/        # Authentication logic
│   ├── recipe/      # Recipe CRUD, forms, cards, and all recipe-related components
│   └── ingredients/ # Ingredient management and related components
├── lib/
│   ├── db/          # Database schema and client
│   ├── auth.ts      # Better Auth configuration
│   └── r2.ts        # R2 object storage utilities
├── routes/          # File-based routing (TanStack Router)
│   ├── index.tsx
│   ├── recipe/
│   ├── settings/
│   ├── shopping-list.tsx
│   └── api/         # API routes
├── stores/          # TanStack Store state management
├── types/           # TypeScript type definitions
└── hooks/           # Custom React hooks
```

## Architecture Patterns

### Feature-Based Organization

For more details about the file structure, look at the `agent_doc/file_structure.md`

### Database

You can find more information about the database in the `agent_doc/database.md` file.

### API Routes

- Follow TanStack Start conventions: files in `src/routes/api/`
- Auth endpoint: `src/routes/api/auth/$.ts` (Better Auth catch-all)
- Image endpoint: `src/routes/api/image/$id.ts` (R2 image serving)

### State Management

- **TanStack Store**: Used for client-side state (shopping list, search)
- **Cookie persistence**: Shopping list persisted in cookies using `@/lib/cookie`
- **React Query**: Server state management, data fetching, caching

### Form Management

This project uses Tanstack form for form management. You can find more information about the implementation by looking at `file_structure/forms.md`

## Code Quality Standards

### Code Factorization and DRY Principles

**CRITICAL: Always prefer code factorization over duplication.**

When writing code, follow these principles:
- **No code duplication**: If you find yourself writing the same code twice, extract it into a shared utility, hook, or component
- **Centralize utilities**: Common helper functions should be placed in `src/lib/utils.ts` or appropriate feature-specific utility files
- **Reuse components**: Extract common UI patterns into reusable components in `src/components/`
- **Share types**: Define types once in `src/types/` or co-located with their primary usage, then import elsewhere
- **Extract hooks**: Shared logic should be extracted into custom hooks in `src/hooks/`

**Before adding new code, always check if:**
1. A similar function/component already exists that you can reuse or extend
2. The code you're writing appears elsewhere and should be extracted
3. A utility function would make the code more maintainable

**Example**: Instead of defining the same `noop` function in multiple files, it should be defined once in `src/lib/utils.ts` and imported where needed.

### Linting Rules (oxlint)

**IMPORTANT** Always lint your code before committing using `bun lint`.

This project enforces strict code quality via oxlint configured in `.oxlintrc.json`:
- No `console` statements allowed (use proper logging)
- No `any` types or non-null assertions
- No unused variables, imports, or function parameters
- Prefer arrow functions over function expressions
- Use `for-of` instead of `Array.forEach`
- Use template literals over string concatenation
- All React hooks must follow rules of hooks
- Accessibility (a11y) rules enforced
- TypeScript: Use `import type`, `export type`, prefer `as const`
- Filename convention: **kebab-case only**

### Shadcn Components

This project uses Coss UI for UI components. You can find the documentation [here](https://coss.com/ui/llms.txt).

Add new Shadcn components using:
```bash
bunx shadcn@latest add @coss/<component-name>
```

## Type Safety

- Path alias: `@/*` maps to `src/*`
- `tsgo` compiler used instead of `tsc` (configured in package.json)
- Strict TypeScript configuration
- Cloudflare Worker types in `worker-configuration.d.ts`

## Deployment (Cloudflare)

Configuration in `wrangler.jsonc`:
- D1 database binding: `DB`
- R2 bucket binding: `R2_BUCKET`
- Cloudflare Images binding: `IMAGES`
- Node.js compatibility enabled

## Git Workflow

- Main branch: `develop`
- Conventional commits enforced via commitlint
- Pre-commit hooks (Lefthook):
  - Lockfile check (bun)
  - oxlint auto-fix on staged files
  - Prettier format on staged files
  - Type checking

## Important Notes

- **Route generation**: `src/routeTree.gen.ts` is auto-generated by TanStack Router - do not edit manually
  - **IMPORTANT**: When you add, delete, or move routes in `src/routes/`, you **MUST** run `bun dev` (or `npm run dev`) to regenerate the route tree
  - The dev server will automatically detect route changes and regenerate `src/routeTree.gen.ts`
  - Without regenerating the route tree, new routes won't be accessible and the app may break
- **Service Worker**: Custom service worker generation in `service-worker-generate.ts` using Workbox
- **Path resolution**: Uses `vite-tsconfig-paths` for `@/*` imports
