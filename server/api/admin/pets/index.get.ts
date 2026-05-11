import { count, desc, eq, sql } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { pets, users } from '~/db/schema'
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

  const conditions = []
  if (status) {
    conditions.push(eq(pets.status, status as any))
  }

  const where = conditions.length > 0 ? sql`${conditions.reduce((acc, cur) => sql`${acc} AND ${cur}`)}` : undefined

  const [totalResult] = await db
    .select({ value: count() })
    .from(pets)
    .where(where)

  const list = await db
    .select({
      id: pets.id,
      name: pets.name,
      species: pets.species,
      city: pets.city,
      status: pets.status,
      createdAt: pets.createdAt,
      publisher: {
        id: users.id,
        nickname: users.nickname,
      },
    })
    .from(pets)
    .leftJoin(users, eq(pets.publisherId, users.id))
    .where(where)
    .orderBy(desc(pets.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return success({
    list,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
