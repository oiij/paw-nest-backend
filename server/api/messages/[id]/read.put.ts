import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { messages } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [message] = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .limit(1)

  if (!message) {
    return error('消息不存在', ErrorCodes.NOT_FOUND)
  }

  if (message.receiverId !== userId) {
    return error('无权限操作', ErrorCodes.FORBIDDEN)
  }

  await db.update(messages)
    .set({ isRead: true })
    .where(eq(messages.id, id))

  return success(null, '已标记已读')
})
