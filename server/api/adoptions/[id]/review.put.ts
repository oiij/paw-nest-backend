import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { object, optional, string } from 'zod'
import { db } from '~/db'
import { adoptions, pets } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  status: string(),
  reviewNote: optional(string()),
})

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { status, reviewNote } = body.data

  if (!['approved', 'rejected'].includes(status)) {
    return error('状态值无效', ErrorCodes.BAD_REQUEST)
  }

  const [adoption] = await db
    .select()
    .from(adoptions)
    .where(eq(adoptions.id, id))
    .limit(1)

  if (!adoption) {
    return error('申请不存在', ErrorCodes.NOT_FOUND)
  }

  const [pet] = await db
    .select()
    .from(pets)
    .where(eq(pets.id, adoption.petId))
    .limit(1)

  if (!pet || pet.publisherId !== userId) {
    return error('无权限审核', ErrorCodes.FORBIDDEN)
  }

  if (!['pending', 'reviewing'].includes(adoption.status)) {
    return error('当前状态无法审核', ErrorCodes.ADOPTION_STATUS_ERROR)
  }

  await db.update(adoptions)
    .set({
      status: status as any,
      reviewerId: userId,
      reviewNote,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adoptions.id, id))

  if (status === 'approved') {
    await db.update(pets)
      .set({ status: 'adopted', updatedAt: new Date() })
      .where(eq(pets.id, adoption.petId))
  }

  return success(null, status === 'approved' ? '已通过' : '已拒绝')
})
