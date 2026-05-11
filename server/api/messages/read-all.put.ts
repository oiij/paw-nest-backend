import { and, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { messages } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId

  await db.update(messages)
    .set({ isRead: true })
    .where(and(eq(messages.receiverId, userId), eq(messages.isRead, false)))

  return success(null, '全部已读')
})
