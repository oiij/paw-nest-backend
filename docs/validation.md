# Validation

This starter uses [Zod](https://zod.dev/) for request body validation, providing type-safe schema validation.

## Basic Usage

```ts
// server/api/zod.post.ts
import { defineHandler } from 'nitro'
import { object, string } from 'zod'

const schema = object({
  foo: string(),
})

export default defineHandler(async (event) => {
  const body = schema.safeParse(await event.req.json())

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: body.error,
    })
  }

  return body.data
})
```

## Schema Definition

Define schemas using Zod's builders:

```ts
import { array, boolean, number, object, string } from 'zod'

const userSchema = object({
  name: string().min(1).max(100),
  email: string().email(),
  age: number().int().positive(),
  isActive: boolean().default(true),
  tags: array(string()),
})
```

## Error Handling

Use `safeParse` for manual error handling:

```ts
export default defineHandler(async (event) => {
  const result = schema.safeParse(await event.req.json())

  if (!result.success) {
    // Return detailed validation errors
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.flatten(),
    })
  }

  // result.data is fully typed
  return result.data
})
```

## Complex Schemas

Build complex validation schemas:

```ts
import { number, object, string, enum as zEnum } from 'zod'

const createPostSchema = object({
  title: string().min(1).max(200),
  content: string().min(10),
  category: zEnum(['tech', 'life', 'travel']),
  priority: number().int().min(1).max(5).optional(),
})

export default defineHandler(async (event) => {
  const body = createPostSchema.parse(await event.req.json())
  // body is fully typed
  return { created: true, ...body }
})
```

## TypeScript Inference

Infer TypeScript types from schemas:

```ts
import { object, string } from 'zod'

const schema = object({
  name: string(),
  email: string(),
})

// Infer the type
type User = z.infer<typeof schema>
// { name: string; email: string }
```

## Best Practices

1. **Always validate** - Never trust user input
2. **Use `safeParse`** - Handle errors gracefully
3. **Provide defaults** - Use `.default()` for optional fields
4. **Share schemas** - Export and reuse across routes
5. **Type inference** - Use `z.infer` for TypeScript types
