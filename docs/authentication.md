# Authentication

This starter includes JWT authentication scaffolding with a plugin, middleware, and utility functions.

## How It Works

1. **Plugin** (`server/plugins/inject-token.ts`) - Reads the `Authorization` header on each request
2. **Middleware** (`server/middleware/verify-token.ts`) - Accesses the injected token from event context
3. **Utils** (`server/utils/jwt.ts`) - JWT sign, verify, and decode functions

## JWT Utility

The `server/utils/jwt.ts` provides three methods:

```ts
import { jwt } from '~/utils/jwt'

// Sign a token (expires in 1 day)
const token = jwt.sign({ userId: 1, role: 'admin' })

// Verify a token
const payload = await jwt.verify<{ userId: number, role: string }>(token)

// Decode without verification
const decoded = jwt.decode(token)
```

## Plugin: Token Injection

The plugin reads the `Authorization` header and makes it available in the event context:

```ts
// server/plugins/inject-token.ts
import { definePlugin } from 'nitro'

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const token = event.req.headers.get('authorization')
    // Token is now available in event.context._token
  })
})
```

## Middleware: Token Verification

Use the middleware to verify tokens on specific routes:

```ts
// server/middleware/verify-token.ts
import { defineMiddleware } from 'nitro'

export default defineMiddleware((event) => {
  const token = event.context._token
  // Verify the token or reject the request
})
```

## Type Augmentation

The `shims.d.ts` file extends the `H3EventContext` interface to add the `_token` property:

```ts
// shims.d.ts
import 'h3'

declare module 'h3' {
  type H3EventContext = {
    _token: string
  }
}
```

## Usage Example

```ts
// server/api/protected.ts
import { defineHandler } from 'nitro'
import { jwt } from '~/utils/jwt'

export default defineHandler(async (event) => {
  const token = event.context._token

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = await jwt.verify(token)
    return { user: payload }
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
```

## Environment Variables

Set your JWT secret in `.env`:

```env
JWT_SECRET=your-secret-key
```

::: warning
Never commit your `.env` file to version control. Use `.env.example` to share required variables.
:::
