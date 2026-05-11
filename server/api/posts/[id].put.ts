import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { array, object, optional, string } from 'zod'
import { db } from '~/db'
import { postImages, posts, postTags } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  title: optional(string().max(200)),
  content: optional(string().min(1)),
  type: optional(string()),
  location: optional(string().max(100)),
  images: optional(array(object({
    url: string(),
    type: optional(string()),
  }))),
  tags: optional(array(string())),
})

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
    return error('无权限修改', ErrorCodes.FORBIDDEN)
  }

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data

  await db.update(posts)
    .set({
      ...data,
      type: data.type as any,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))

  if (data.images) {
    await db.delete(postImages).where(eq(postImages.postId, id))
    if (data.images.length > 0) {
      await db.insert(postImages).values(
        data.images.map((img, index) => ({
          id: nanoid(21),
          url: img.url,
          type: img.type || 'image',
          sort: index,
          postId: id,
          createdAt: new Date(),
        })),
      )
    }
  }

  if (data.tags) {
    await db.delete(postTags).where(eq(postTags.postId, id))
    if (data.tags.length > 0) {
      await db.insert(postTags).values(
        data.tags.map(name => ({
          id: nanoid(21),
          name,
          postId: id,
        })),
      )
    }
  }

  return success(null, '更新成功')
})
