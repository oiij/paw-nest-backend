import { count, desc, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { reports, users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const query = event.url.searchParams
  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 20
  const status = query.get('status')

  const where = status ? eq(reports.status, status as any) : undefined

  const [totalResult] = await db
    .select({ value: count() })
    .from(reports)
    .where(where)

  const list = await db
    .select({
      id: reports.id,
      targetType: reports.targetType,
      targetId: reports.targetId,
      reason: reports.reason,
      status: reports.status,
      handleNote: reports.handleNote,
      createdAt: reports.createdAt,
      handledAt: reports.handledAt,
      reporter: {
        id: users.id,
        nickname: users.nickname,
      },
    })
    .from(reports)
    .leftJoin(users, eq(reports.reporterId, users.id))
    .where(where)
    .orderBy(desc(reports.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return success({
    list,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
