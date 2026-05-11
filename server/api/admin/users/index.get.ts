import { count, desc } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { users } from '~/db/schema'
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
    .from(users)

  const list = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      avatar: users.avatar,
      phone: users.phone,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return success({
    list,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
