# Plugins

Plugins run at server startup and can hook into the Nitro application lifecycle.

## Basic Usage

Create a file in the `server/plugins/` directory:

```ts
// server/plugins/my-plugin.ts
import { definePlugin } from 'nitro'

export default definePlugin((nitroApp) => {
  console.log('Plugin loaded!')

  // Hook into request lifecycle
  nitroApp.hooks.hook('request', (event) => {
    console.log(`Request: ${event.method} ${event.path}`)
  })
})
```

## Available Hooks

Nitro provides several lifecycle hooks:

### request

Fires on every incoming request:

```ts
nitroApp.hooks.hook('request', (event) => {
  // Access request data
  const path = event.path
  const method = event.method
})
```

### beforeResponse

Fires before sending the response:

```ts
nitroApp.hooks.hook('beforeResponse', (event, response) => {
  // Modify response
  console.log('Response status:', response.status)
})
```

### afterResponse

Fires after the response is sent:

```ts
nitroApp.hooks.hook('afterResponse', (event, response) => {
  // Log analytics, etc.
})
```

### error

Fires when an error occurs:

```ts
nitroApp.hooks.hook('error', (event, error) => {
  console.error('Server error:', error)
})
```

## Example: Request Timing

```ts
// server/plugins/timing.ts
import { definePlugin } from 'nitro'

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    event.context.startTime = Date.now()
  })

  nitroApp.hooks.hook('afterResponse', (event, response) => {
    const duration = Date.now() - event.context.startTime
    response.headers.set('X-Response-Time', `${duration}ms`)
  })
})
```

## Example: API Key Validation

```ts
// server/plugins/api-key.ts
import { definePlugin } from 'nitro'

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    if (event.path.startsWith('/api/')) {
      const apiKey = event.req.headers.get('x-api-key')
      if (apiKey !== process.env.API_KEY) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid API key' })
      }
    }
  })
})
```
