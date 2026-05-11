import { count, desc, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { posts, users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const query = event.url.searchParams
  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 20

  const [totalResult] = await db
    .select({ value: count() })
    .from(posts)

  const list = await db
    .select({
      id: posts.id,
      title: posts.title,
      type: posts.type,
      status: posts.status,
      createdAt: posts.createdAt,
      user: {
        id: users.id,
        nickname: users.nickname,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return success({
    list,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
