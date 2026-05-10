import { defineHandler } from 'nitro'
import { object, string } from 'zod'

const schema = object({
  foo: string(),
})
export default defineHandler(async (event) => {
  const body = schema.safeParse(await event.req.json())
  return body
})
