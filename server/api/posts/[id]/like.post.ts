import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { favorites, posts } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

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

  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(
      eq(favorites.userId, userId),
      eq(favorites.targetType, 'post'),
      eq(favorites.targetId, id),
    ))
    .limit(1)

  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id))
    await db.update(posts)
      .set({ likeCount: Math.max(0, post.likeCount - 1) })
      .where(eq(posts.id, id))
    return success({ liked: false }, '已取消点赞')
  }
  else {
    await db.insert(favorites).values({
      id: nanoid(21),
      userId,
      targetType: 'post',
      targetId: id,
      createdAt: new Date(),
    })
    await db.update(posts)
      .set({ likeCount: post.likeCount + 1 })
      .where(eq(posts.id, id))
    return success({ liked: true }, '已点赞')
  }
})
