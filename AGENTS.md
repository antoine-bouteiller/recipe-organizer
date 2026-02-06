# Recipe Organizer

Full-stack recipe management app built with TanStack Start, deployed on Cloudflare Workers.

## Quick Reference

- **Package Manager:** Bun (never npm/yarn)
- **Dev:** `bun dev`
- **Build:** `bun run build`
- **Test:** `bun test`
- **Typecheck:** `bun typecheck`
- **Lint:** `bun lint`
- **Format:** `bun format`

## Critical Rules

- **Always lint before committing:** `bun lint`
- **Route changes require regeneration:** Run `bun dev` after adding/moving routes
- **Add Shadcn components:** `bunx shadcn@latest add @coss/<component-name>`

## Guidelines

- [Project Structure](agents_doc/file_structure.md)
- [Database Schema](agents_doc/database.md)
- [Form Patterns](agents_doc/forms.md)
- [Code Quality & Linting](agents_doc/code-quality.md)
- [Architecture](agents_doc/architecture.md)
- [Deployment & Git](agents_doc/deployment.md)
