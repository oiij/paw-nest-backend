import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { object, optional, string } from 'zod'
import { db } from '~/db'
import { users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  nickname: optional(string().min(1).max(50)),
  gender: optional(string()),
  city: optional(string().max(50)),
  bio: optional(string().max(500)),
})

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data

  await db.update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return success(null, '更新成功')
})
