# nitro-starter

A production-ready [Nitro.js](https://nitro.unjs.io/) v3 starter template with TypeScript, JWT authentication, Zod validation, and VitePress documentation.

## Features

- **Nitro.js v3** - Next-generation server toolkit for building universal JS/TS servers
- **File-based API Routing** - Auto-discover routes from the `api/` directory
- **JWT Authentication** - Plugin + middleware scaffolding for token-based auth
- **Zod Validation** - Request body validation with Zod schemas
- **VitePress Docs** - Built-in documentation site with custom theme and dark mode
- **Vitest** - Fast unit testing with Vitest
- **ESLint + Prettier** - Code quality via `@antfu/eslint-config`
- **Commit Linting** - Conventional commits with `commitlint` + `cz-git`
- **Git Hooks** - Pre-commit linting via `simple-git-hooks`

## Tech Stack

| Technology   | Role              |
| ------------ | ----------------- |
| Nitro v3     | Server framework  |
| TypeScript   | Language          |
| Zod          | Schema validation |
| jsonwebtoken | JWT auth          |
| VitePress    | Documentation     |
| Vitest       | Testing           |
| ESLint       | Linting           |
| pnpm         | Package manager   |

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (port 5677)
pnpm dev
```

The API server will be available at `http://localhost:5677`.

## Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start Nitro dev server    |
| `pnpm build`        | Build for production      |
| `pnpm test`         | Run tests                 |
| `pnpm lint`         | Lint all files            |
| `pnpm lint:fix`     | Lint and auto-fix         |
| `pnpm type:check`   | TypeScript type check     |
| `pnpm docs:dev`     | Start docs dev server     |
| `pnpm docs:build`   | Build docs for production |
| `pnpm docs:preview` | Preview built docs        |
| `pnpm cz`           | Interactive commit        |
| `pnpm release`      | Bump version and publish  |

## Project Structure

```
nitro-starter/
├── server/               # Nitro server source (serverDir)
│   ├── api/              # API routes (file-based routing)
│   │   ├── hello.ts      # GET /api/hello
│   │   └── zod.post.ts   # POST /api/zod (Zod validation)
│   ├── middleware/        # Nitro middleware
│   │   └── verify-token.ts   # Token verification
│   ├── plugins/          # Nitro plugins
│   │   └── inject-token.ts   # Auth header injection
│   └── utils/            # Shared utilities
│       └── jwt.ts        # JWT sign/verify/decode
├── docs/                 # VitePress documentation
├── nitro.config.ts       # Nitro configuration
├── tsconfig.json         # TypeScript config
└── vitest.config.ts      # Test config
```

## API Examples

### Hello World

```bash
curl http://localhost:5677/api/hello
# "Nitro is amazing!"
```

### Zod Validation

```bash
curl -X POST http://localhost:5677/api/zod \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

## Configuration

### Nitro (`nitro.config.ts`)

```ts
import { defineConfig } from 'nitro'

export default defineConfig({
  serverDir: './server',
  devServer: {
    port: 5677,
  },
})
```

### Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key
```

## License

[MIT](./LICENSE) &copy; 2025 [oiij](https://github.com/oiij)
