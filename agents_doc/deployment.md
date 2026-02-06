# Deployment & Git

## Cloudflare Configuration

Config file: `wrangler.jsonc`

| Binding | Name |
|---------|------|
| D1 Database | `DB` |
| R2 Bucket | `R2_BUCKET` |
| Cloudflare Images | `IMAGES` |

Node.js compatibility enabled.

## Git Workflow

- **Main branch:** `main`
- **Commits:** Conventional commits enforced via commitlint

### Pre-commit Hooks (Lefthook)

1. Lockfile check (bun)
2. oxlint auto-fix on staged files
3. Prettier format on staged files
4. Type checking
