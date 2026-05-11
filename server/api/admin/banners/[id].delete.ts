import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { banners } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const id = event.url.pathname.split('/').filter(Boolean).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [banner] = await db.select().from(banners).where(eq(banners.id, id)).limit(1)

  if (!banner) {
    return error('Banner 不存在', ErrorCodes.NOT_FOUND)
  }

  await db.delete(banners).where(eq(banners.id, id))

  return success(null, '已删除')
})
