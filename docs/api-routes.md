# API Routes

Nitro uses file-based routing. Files in the `server/api/` directory are automatically registered as API endpoints.

## Basic Routes

Create a file in `server/api/` to define a route:

```ts
// server/api/hello.ts
import { defineHandler } from 'nitro'

export default defineHandler(() => {
  return 'Hello World!'
})
```

This creates a `GET /api/hello` endpoint.

## HTTP Methods

Use the filename suffix to specify the HTTP method:

| File                         | Method | Route        |
| ---------------------------- | ------ | ------------ |
| `server/api/hello.ts`        | GET    | `/api/hello` |
| `server/api/hello.post.ts`   | POST   | `/api/hello` |
| `server/api/hello.put.ts`    | PUT    | `/api/hello` |
| `server/api/hello.delete.ts` | DELETE | `/api/hello` |
| `server/api/hello.patch.ts`  | PATCH  | `/api/hello` |

## Dynamic Routes

Use square brackets for dynamic segments:

```ts
// server/api/users/[id].ts
import { defineHandler } from 'nitro'

export default defineHandler((event) => {
  const id = event.context.params.id
  return { id }
})
```

This creates `GET /api/users/:id`.

## Request Data

Access request data through the `event` object:

```ts
import { defineHandler } from 'nitro'

export default defineHandler(async (event) => {
  // Query parameters
  const query = event.query

  // Route params
  const params = event.context.params

  // Request body
  const body = await event.req.json()

  // Headers
  const authorization = event.req.headers.get('authorization')

  return { query, params, body, authorization }
})
```

## Response Helpers

Nitro provides helpers for common responses:

```ts
import { defineHandler, sendError, setResponseHeader } from 'nitro'

export default defineHandler((event) => {
  // Set headers
  setResponseHeader(event, 'Content-Type', 'application/json')

  // Return JSON
  return { message: 'Success' }

  // Or throw an error
  // throw createError({ statusCode: 404, statusMessage: 'Not Found' })
})
```

## Example: CRUD API

```ts
// server/api/users/index.ts - List users
import { defineHandler } from 'nitro'

export default defineHandler(() => {
  return [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ]
})
```

```ts
// server/api/users/[id].ts - Get user by ID
import { defineHandler } from 'nitro'

export default defineHandler((event) => {
  const { id } = event.context.params
  return { id, name: 'John' }
})
```
