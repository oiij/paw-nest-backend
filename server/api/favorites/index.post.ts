import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { object, string } from 'zod'
import { db } from '~/db'
import { favorites, pets, posts } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  targetType: string(),
  targetId: string(),
})

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { targetType, targetId } = body.data

  if (!['pet', 'post'].includes(targetType)) {
    return error('类型错误', ErrorCodes.BAD_REQUEST)
  }

  if (targetType === 'pet') {
    const [pet] = await db.select().from(pets).where(eq(pets.id, targetId)).limit(1)
    if (!pet) {
      return error('宠物不存在', ErrorCodes.NOT_FOUND)
    }
  }
  else {
    const [post] = await db.select().from(posts).where(eq(posts.id, targetId)).limit(1)
    if (!post) {
      return error('帖子不存在', ErrorCodes.NOT_FOUND)
    }
  }

  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(
      eq(favorites.userId, userId),
      eq(favorites.targetType, targetType as any),
      eq(favorites.targetId, targetId),
    ))
    .limit(1)

  if (existing) {
    return error('已收藏', ErrorCodes.ALREADY_EXISTS)
  }

  const id = nanoid(21)
  await db.insert(favorites).values({
    id,
    userId,
    targetType: targetType as any,
    targetId,
    createdAt: new Date(),
  })

  return success({ id }, '收藏成功')
})
