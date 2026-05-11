import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { comments, posts } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1)

  if (!comment) {
    return error('评论不存在', ErrorCodes.NOT_FOUND)
  }

  if (comment.userId !== userId) {
    return error('无权限删除', ErrorCodes.FORBIDDEN)
  }

  await db.delete(comments).where(eq(comments.id, id))

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, comment.postId))
    .limit(1)

  if (post) {
    await db.update(posts)
      .set({ commentCount: Math.max(0, post.commentCount - 1) })
      .where(eq(posts.id, comment.postId))
  }

  return success(null, '删除成功')
})
