# Configuration

## Nitro Configuration

The main configuration file is `nitro.config.ts`:

```ts
import { defineConfig } from 'nitro'

export default defineConfig({
  // Server directory (root by default)
  serverDir: './',

  // Dev server settings
  devServer: {
    port: 5677,
  },

  // Additional options
  // https://nitro.unjs.io/config
})
```

## TypeScript Configuration

The project extends a shared tsconfig:

```json
{
  "extends": "@oiij/tsconfig/tsconfig.json",
  "compilerOptions": {
    "jsxImportSource": "vue",
    "moduleResolution": "Bundler",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["src", "docs"],
  "exclude": ["node_modules", "dist", "test"]
}
```

## ESLint Configuration

Uses `@antfu/eslint-config` with formatters:

```ts
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  // Options
})
```

## Vitest Configuration

Test configuration in `vitest.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

## Commit Linting

Conventional commits are enforced via `commitlint.config.js` with `cz-git` for interactive prompts.

### Commit Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type     | Description   |
| -------- | ------------- |
| feat     | New feature   |
| fix      | Bug fix       |
| docs     | Documentation |
| style    | Code style    |
| refactor | Refactoring   |
| test     | Tests         |
| chore    | Build/tooling |
| perf     | Performance   |
| ci       | CI/CD         |

## Environment Variables

Create a `.env` file for local configuration:

```env
# Server
PORT=5677

# JWT
JWT_SECRET=your-secret-key

# API
API_KEY=your-api-key
```

::: warning
Never commit `.env` files. Use `.env.example` to document required variables.
:::

## Package Manager

This project enforces pnpm via the `preinstall` script:

```json
{
  "preinstall": "npx only-allow pnpm"
}
```

### Registry Configuration

The `.npmrc` file configures the npm registry:

```ini
registry=https://registry.npmmirror.com/
shamefully-hoist=true
auto-install-peers=true
```

## Git Hooks

Pre-commit hooks run automatically via `simple-git-hooks`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged && pnpm type:check"
  }
}
```

This ensures all staged files are linted and type-checked before committing.
