# Cahayoyo Cockpit

Self-hosted personal dashboard for a QA engineer — bookmarks, notes, tasks, QA utilities, disposable-email tracking, and an encrypted vault in one place.

> Status: Phase 1 (scaffold). Modules are built incrementally; the app shell runs, but no features are live yet.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 + Svelte 5 (runes) on [Bun](https://bun.sh)
- Tailwind CSS 4 + [shadcn-svelte](https://shadcn-svelte.com) + `mode-watcher` + `@lucide/svelte`
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL (`drizzle-orm/bun-sql`)
- [Better Auth](https://www.better-auth.com) (email + password, no public signup)
- Zod 4

## Requirements

- Bun 1.4+
- PostgreSQL (local instance for development)

## Setup

```sh
bun install
cp .env.example .env   # then replace the placeholder values
```

| Variable               | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string                       |
| `BETTER_AUTH_SECRET`   | Session signing secret (`openssl rand -base64 32`) |
| `VAULT_ENCRYPTION_KEY` | AES-256-GCM key for vault entries (Phase 10)       |

## Development

```sh
bun run dev     # dev server on http://localhost:5173
bun run check   # svelte-check (types)
bun run lint    # prettier + eslint
bun test        # unit tests (bun:test)
bun run build   # production build (svelte-adapter-bun)
```

## Database

Drizzle schema lives in `src/lib/server/db/schema.ts` (populated in Phase 2).

```sh
bun run db:generate   # generate a migration from the schema
bun run db:migrate    # apply migrations
```

## Deployment

Docker container on a Hostinger VPS via Coolify; production deploys from `main` only. Not provisioned yet.
