# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Organizer is a full-stack recipe management application built with TanStack Start (React SSR framework), deployed on Cloudflare Workers. The app manages recipes, ingredients, and shopping lists with authentication via Better Auth.

## Tech Stack

- **Frontend**: React 19, TanStack Router (file-based routing), TanStack Query, TanStack Form, TanStack Store
- **Backend**: TanStack Start (SSR), Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare R2 (object storage)
- **Database**: Drizzle ORM with D1 SQLite
- **Auth**: Better Auth with Google OAuth
- **Styling**: Tailwind CSS v4, Shadcn UI components (Base UI)
- **Rich Text**: TipTap editor
- **Linting/Formatting**: oxlint, Prettier
- **Testing**: Vitest
- **Git Hooks**: Lefthook with commitlint (conventional commits)

## Development Commands

```bash
# Development server (port 3000)
bun dev

# Build for production
bun build

# Type checking
bun typecheck

# Linting (auto-fix)
bun lint

# Formatting
bun format

# Run tests
bun test

# Preview production build
bun serve

# Database operations
bun database:dump    # Export D1 data to database.sql
bun database:import  # Import database.sql to D1

# Generate Cloudflare types
bun cf-typegen
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

Features are organized in `src/features/` with the following structure:
- `api/` - React Query hooks and API functions (create, edit, delete, get-all, get-one, get-by-ids)
  - Each API file exports query/mutation options for use with TanStack Query
  - `query-keys.ts` - Centralized query key factory
- **Feature components** - All components related to a feature live directly in the feature folder
  - Forms for creating/editing (e.g., `recipe-form.tsx`)
  - Display components (e.g., `recipe-card.tsx`, `recipe-section.tsx`)
  - Feature-specific UI (e.g., `search-bar.tsx`, `delete-recipe.tsx`)

**Important**: When creating new components for a feature (forms, cards, modals, etc.), place them in the corresponding feature folder, not in `src/components/`. The `src/components/` directory is reserved for generic, reusable UI components.

### Database Schema

Core entities:
- **recipes**: id, name, image, steps, quantity, tags (JSON array)
- **ingredients**: id, name, allowedUnits (JSON array), category, parentId (for sub-ingredients)
- **recipe_ingredients**: Joins recipes with ingredients, includes sections
- **auth tables**: Managed by Better Auth (user, session, account, verification)

### API Routes

- Follow TanStack Start conventions: files in `src/routes/api/`
- Auth endpoint: `src/routes/api/auth/$.ts` (Better Auth catch-all)
- Image endpoint: `src/routes/api/image/$id.ts` (R2 image serving)

### State Management

- **TanStack Store**: Used for client-side state (shopping list, search)
- **Cookie persistence**: Shopping list persisted in cookies using `@/lib/cookie`
- **React Query**: Server state management, data fetching, caching

### Form Management

**CRITICAL: All forms in this project MUST use TanStack Form. Never use manual state management (useState) for forms.**

This project uses TanStack Form (`@tanstack/react-form`) for all form handling. The form architecture is built around the `use-app-form.ts` hook.

#### Form Pattern (REQUIRED)

**For feature forms** (creating/editing entities like recipes, units, ingredients):

1. **Define form input types, default values, and create field map:**
```typescript
import { createFieldMap } from '@tanstack/react-form'

export interface UnitFormInput {
  name: string
  symbol: string
  parentId: string | undefined
  factor: number | undefined
}

export const unitDefaultValues: UnitFormInput = {
  name: '',
  symbol: '',
  parentId: undefined,
  factor: undefined,
}

// REQUIRED: Create field map for TanStack Form
export const unitFormFields = createFieldMap(unitDefaultValues)
```

2. **Create form component using `withFieldGroup`:**
```typescript
import { withFieldGroup } from '@/hooks/use-app-form'

export const UnitForm = withFieldGroup({
  defaultValues: unitDefaultValues,
  props: {} as UnitFormProps,
  render: function Render({ group, ...props }) {
    const { AppField } = group
    const isSubmitting = useStore(group.form.store, (state) => state.isSubmitting)

    return (
      <>
        <AppField name="name">
          {({ TextField }) => (
            <TextField label="Nom" placeholder="..." disabled={isSubmitting} />
          )}
        </AppField>
        {/* More fields... */}
        <group.form.AppForm>
          <group.form.FormSubmit label="Submit" />
        </group.form.AppForm>
      </>
    )
  },
})
```

3. **Use the form in route/dialog components with `useAppForm`:**
```typescript
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { unitDefaultValues, unitFormFields, UnitForm } from './unit-form'

const form = useAppForm({
  validators: { onDynamic: myZodSchema },
  validationLogic: revalidateLogic(),
  defaultValues: unitDefaultValues,
  onSubmit: async (data) => {
    const parsedData = myZodSchema.parse(data.value)
    await mutation.mutateAsync({ data: parsedData })
  },
})

// In JSX: IMPORTANT - must pass both form AND fields props
<form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit() }}>
  <UnitForm form={form} fields={unitFormFields} {...props} />
</form>
```

#### Available Field Components

The `AppField` component provides these field types:
- `TextField` - Text inputs
- `NumberField` - Numeric inputs with decimal support
- `ComboboxField` - Searchable select with custom options
- `ImageField` - Image upload with preview
- `TiptapField` - Rich text editor

**NEVER use Base UI Select components directly in forms** - always use `ComboboxField` through `AppField`.

#### Examples

- **Recipe forms**: `src/features/recipe/recipe-form.tsx`, `src/routes/recipe/new.tsx`
- **Unit forms**: `src/features/units/unit-form.tsx`, `src/features/units/add-unit.tsx`

### Authentication

- Better Auth with Drizzle adapter
- Google OAuth (requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in env)
- Sign-up disabled (`disableSignUp: true`)
- Auth guard: `src/features/auth/auth-guard.ts`

## Code Quality Standards

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

Add new Shadcn components using:
```bash
bunx shadcn@latest add <component-name>
```

Components use Base UI (@base-ui-components/react) instead of Radix UI.

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

## Testing

- Vitest configured
- Run with `bun test`

## Important Notes

- **Route generation**: `src/routeTree.gen.ts` is auto-generated by TanStack Router - do not edit manually
  - **IMPORTANT**: When you add, delete, or move routes in `src/routes/`, you **MUST** run `bun dev` (or `npm run dev`) to regenerate the route tree
  - The dev server will automatically detect route changes and regenerate `src/routeTree.gen.ts`
  - Without regenerating the route tree, new routes won't be accessible and the app may break
- **Service Worker**: Custom service worker generation in `service-worker-generate.ts` using Workbox
- **Path resolution**: Uses `vite-tsconfig-paths` for `@/*` imports
