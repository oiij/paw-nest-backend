import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { number, object, optional, string } from 'zod'
import { db } from '~/db'
import { banners } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  title: optional(string().min(1).max(100)),
  image: optional(string()),
  link: optional(string()),
  linkType: optional(string()),
  sort: optional(number()),
  status: optional(string()),
  startTime: optional(string()),
  endTime: optional(string()),
})

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const id = event.url.pathname.split('/').filter(Boolean).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data

  const [banner] = await db.select().from(banners).where(eq(banners.id, id)).limit(1)

  if (!banner) {
    return error('Banner 不存在', ErrorCodes.NOT_FOUND)
  }

  await db.update(banners)
    .set({
      ...data,
      linkType: data.linkType as any,
      status: data.status as any,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(banners.id, id))

  return success(null, '更新成功')
})
