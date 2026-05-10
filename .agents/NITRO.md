# Nitro Documentation Reference

> Source: https://nitro.build/llms-full.txt

## Quick Commands

- `pnpm dev` — Nitro dev server on port 5677
- `pnpm build` — production build
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm type:check` — TypeScript (`tsc --noEmit`)
- `pnpm test` — Vitest
- `pnpm docs:dev` — VitePress docs dev server

## Core Concepts

### Filesystem Routing

Routes are defined by creating files in `server/api/` or `server/routes/`:
- `server/api/test.ts` → `/api/test`
- `server/api/test.post.ts` → `/api/test` (POST only)
- Dynamic: `server/api/users/[id].ts` → `/api/users/:id`
- Catch-all: `server/api/[...].ts`

### Route Rules

```ts
// nitro.config.ts
routeRules: {
  '/blog/**': { swr: true },
  '/api/v1/**': { cors: true },
  '/old-page': { redirect: '/new-page' },
  '/proxy/**': { proxy: 'https://api.example.com/**' },
}
```

### Middleware

Files in `server/middleware/` run on every request. Execute in directory listing order (prefix with numbers to control).

### Storage

Use `useStorage()` for key-value storage with 20+ drivers (FS, Redis, S3, etc.).

### Database

Built-in SQL database layer. Defaults to SQLite, supports Postgres, MySQL, PGLite, etc.

### Caching

Route caching via `defineCachedHandler` or route rules (`swr`, `static`, `cache`).

### Runtime Config

```ts
runtimeConfig: {
  apiToken: "dev_token",
}
// Access: useRuntimeConfig().apiToken
// Env: NITRO_API_TOKEN="value"
```

### Vite Integration

```ts
// vite.config.ts
import { nitro } from "nitro/vite";
export default defineConfig({
  plugins: [nitro()],
});
```

### Server Assets

- `public/` → served to clients
- `assets/` → bundled into server, access via `useStorage("assets:server")`

### Plugins

Files in `server/plugins/` run at startup.

### Tasks

One-off runtime operations via `defineTask`.

### WebSocket

Cross-platform WebSocket support via CrossWS and H3.

### OpenAPI

Auto-generate OpenAPI spec from route handlers.

## Deploy Targets

Node.js, Bun, Deno, Cloudflare Workers, Netlify, Vercel, AWS Lambda, Firebase, and 20+ more.

## Key Config Options

| Option | Default | Description |
|--------|---------|-------------|
| `serverDir` | `false` | Server source directory |
| `baseURL` | `"/"` | Base URL for all routes |
| `runtimeConfig` | `{}` | Runtime configuration |
| `routeRules` | `{}` | Route matching rules |
| `compressPublicAssets` | `false` | Pre-compress public assets |
