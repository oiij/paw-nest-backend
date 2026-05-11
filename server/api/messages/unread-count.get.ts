import { and, count, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { messages } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const [result] = await db
    .select({ value: count() })
    .from(messages)
    .where(and(eq(messages.receiverId, userId), eq(messages.isRead, false)))

  return success({ count: result?.value || 0 })
})
