import { and, count, desc, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { comments, users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const postId = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

  if (!postId) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const query = event.url.searchParams
  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 20

  const where = and(eq(comments.postId, postId), eq(comments.status, 'active'))

  const [totalResult] = await db
    .select({ value: count() })
    .from(comments)
    .where(where)

  const list = await db
    .select({
      id: comments.id,
      content: comments.content,
      likeCount: comments.likeCount,
      parentId: comments.parentId,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        nickname: users.nickname,
        avatar: users.avatar,
      },
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(where)
    .orderBy(desc(comments.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return success({
    list,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
