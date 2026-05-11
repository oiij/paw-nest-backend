import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { favorites } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [favorite] = await db
    .select()
    .from(favorites)
    .where(eq(favorites.id, id))
    .limit(1)

  if (!favorite) {
    return error('收藏不存在', ErrorCodes.NOT_FOUND)
  }

  if (favorite.userId !== userId) {
    return error('无权限操作', ErrorCodes.FORBIDDEN)
  }

  await db.delete(favorites).where(eq(favorites.id, id))

  return success(null, '已取消收藏')
})
