import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { array, object, optional, string } from 'zod'
import { db } from '~/db'
import { postImages, posts, postTags } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  title: optional(string().max(200)),
  content: string().min(1),
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

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data
  const postId = nanoid(21)
  const now = new Date()

  await db.insert(posts).values({
    id: postId,
    userId,
    title: data.title,
    content: data.content,
    type: (data.type as any) || 'dynamic',
    location: data.location,
    createdAt: now,
    updatedAt: now,
  })

  if (data.images && data.images.length > 0) {
    await db.insert(postImages).values(
      data.images.map((img, index) => ({
        id: nanoid(21),
        url: img.url,
        type: img.type || 'image',
        sort: index,
        postId,
        createdAt: now,
      })),
    )
  }

  if (data.tags && data.tags.length > 0) {
    await db.insert(postTags).values(
      data.tags.map(name => ({
        id: nanoid(21),
        name,
        postId,
      })),
    )
  }

  return success({ id: postId }, '发布成功')
})
