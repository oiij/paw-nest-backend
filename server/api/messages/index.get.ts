import { and, count, desc, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { messages, users } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const query = event.url.searchParams

  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 20
  const type = query.get('type')
  const isRead = query.get('isRead')

  const conditions = [eq(messages.receiverId, userId)]

  if (type) {
    conditions.push(eq(messages.type, type as any))
  }
  if (isRead !== null && isRead !== undefined) {
    conditions.push(eq(messages.isRead, isRead === 'true'))
  }

  const where = and(...conditions)

  const [totalResult] = await db
    .select({ value: count() })
    .from(messages)
    .where(where)

  const list = await db
    .select({
      id: messages.id,
      type: messages.type,
      title: messages.title,
      content: messages.content,
      data: messages.data,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      sender: {
        id: users.id,
        nickname: users.nickname,
        avatar: users.avatar,
      },
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .where(where)
    .orderBy(desc(messages.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return success({
    list,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
