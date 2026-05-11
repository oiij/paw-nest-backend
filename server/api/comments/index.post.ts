import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { object, optional, string } from 'zod'
import { db } from '~/db'
import { comments, posts } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  postId: string(),
  parentId: optional(string()),
  content: string().min(1).max(1000),
})

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { postId, parentId, content } = body.data

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (!post) {
    return error('帖子不存在', ErrorCodes.NOT_FOUND)
  }

  const id = nanoid(21)
  const now = new Date()

  await db.insert(comments).values({
    id,
    userId,
    postId,
    parentId,
    content,
    createdAt: now,
    updatedAt: now,
  })

  await db.update(posts)
    .set({ commentCount: post.commentCount + 1 })
    .where(eq(posts.id, postId))

  return success({ id }, '评论成功')
})
