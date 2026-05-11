import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { postImages, posts, postTags, users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
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

  await db.update(posts)
    .set({ viewCount: post.viewCount + 1 })
    .where(eq(posts.id, id))

  const [user] = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, post.userId))
    .limit(1)

  const images = await db
    .select()
    .from(postImages)
    .where(eq(postImages.postId, id))

  const tags = await db
    .select()
    .from(postTags)
    .where(eq(postTags.postId, id))

  return success({
    ...post,
    user,
    images: images.map(img => ({ url: img.url, type: img.type })),
    tags: tags.map(tag => tag.name),
  })
})
