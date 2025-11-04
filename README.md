# Recipe Organizer

A modern, full-stack recipe management application built with TanStack Start and deployed on Cloudflare Workers.

## Features

- **Recipe Management**: Create, edit, and organize your recipes with rich text descriptions and images
- **Ingredient Database**: Maintain a database of ingredients with customizable units and categories
- **Shopping List**: Generate shopping lists from selected recipes with automatic quantity calculations
- **Search & Filter**: Find recipes quickly with real-time search
- **Authentication**: Secure Google OAuth authentication via Better Auth
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Offline Support**: Service worker integration for offline functionality

## Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Query, TanStack Form, TanStack Store
- **Backend**: TanStack Start (SSR), Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 for image storage
- **Styling**: Tailwind CSS v4, Shadcn UI components
- **Authentication**: Better Auth with Google OAuth

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Cloudflare account (for deployment)
- Google OAuth credentials (for authentication)

### Installation

```bash
# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file with the following:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Development

```bash
# Run development server (port 3000)
bun dev

# Type checking
bun typecheck

# Linting with auto-fix
bun lint

# Format code
bun format

# Run tests
bun test
```

### Building

```bash
# Build for production
bun build

# Preview production build
bun serve
```

### Database Management

```bash
# Export D1 database to database.sql
bun database:dump

# Import database.sql to D1
bun database:import

# Generate Cloudflare types
bun cf-typegen
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── forms/       # Generic form fields
│   └── ui/          # Shadcn UI components
├── features/        # Feature modules (auth, recipe, ingredients)
├── lib/             # Database, auth, utilities
├── routes/          # File-based routing
├── stores/          # Client state management
├── types/           # TypeScript definitions
└── hooks/           # Custom React hooks
```

## Contributing

This project uses:
- **Conventional Commits** for commit messages
- **Lefthook** for pre-commit hooks (linting, formatting, type checking)
- **oxlint** for fast, strict linting
- **Prettier** for code formatting

## Deployment

Configured for Cloudflare Workers with:
- D1 database binding
- R2 bucket for images
- Cloudflare Images integration

See `wrangler.jsonc` for configuration details.

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
