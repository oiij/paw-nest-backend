import { and, asc, eq, gte, isNull, lte, or } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { banners } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async () => {
  const now = new Date()

  const list = await db
    .select({
      id: banners.id,
      title: banners.title,
      image: banners.image,
      link: banners.link,
      linkType: banners.linkType,
    })
    .from(banners)
    .where(and(
      eq(banners.status, 'active'),
      or(isNull(banners.startTime), lte(banners.startTime, now)),
      or(isNull(banners.endTime), gte(banners.endTime, now)),
    ))
    .orderBy(asc(banners.sort))

  return success(list)
})
