# Middleware

Middleware runs before route handlers, allowing you to modify requests, add headers, or reject requests.

## Basic Usage

Create a file in the `server/middleware/` directory:

```ts
// server/middleware/logging.ts
import { defineMiddleware } from 'nitro'

export default defineMiddleware((event) => {
  console.log(`${event.method} ${event.path}`)
})
```

## Named Middleware

Use filename prefixes to apply middleware to specific routes:

| File                            | Applies to               |
| ------------------------------- | ------------------------ |
| `server/middleware/auth.ts`     | All routes               |
| `server/middleware/api.ts`      | `/api/**` routes         |
| `server/middleware/api-auth.ts` | `/api/**` routes (named) |

## Access Event Context

Middleware receives the event object with full access to request data:

```ts
import { defineMiddleware } from 'nitro'

export default defineMiddleware((event) => {
  // Access headers
  const userAgent = event.req.headers.get('user-agent')

  // Access query params
  const token = event.query.token

  // Access route params
  const id = event.context.params?.id

  // Modify context
  event.context.user = { name: 'John' }
})
```

## Response Modification

Set response headers or status codes:

```ts
import { defineMiddleware, setResponseHeader, setResponseStatus } from 'nitro'

export default defineMiddleware((event) => {
  // Add security headers
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'X-Frame-Options', 'DENY')

  // Or redirect
  if (!event.query.token) {
    setResponseStatus(event, 302)
    setResponseHeader(event, 'Location', '/login')
  }
})
```

## Error Handling

Throw errors to reject requests:

```ts
import { createError, defineMiddleware } from 'nitro'

export default defineMiddleware((event) => {
  const token = event.req.headers.get('authorization')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
```

## Example: CORS Middleware

```ts
// server/middleware/cors.ts
import { defineMiddleware, setResponseHeader } from 'nitro'

export default defineMiddleware((event) => {
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
})
```
