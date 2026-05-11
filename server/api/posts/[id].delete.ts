import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { posts } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  if (!post) {
    return error('帖子不存在', ErrorCodes.NOT_FOUND)
  }

  if (post.userId !== userId) {
    return error('无权限删除', ErrorCodes.FORBIDDEN)
  }

  await db.delete(posts).where(eq(posts.id, id))

  return success(null, '删除成功')
})
