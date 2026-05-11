import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { object, optional, string } from 'zod'
import { db } from '~/db'
import { pets } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  status: string(),
  note: optional(string()),
})

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const id = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { status } = body.data

  if (!['available', 'rejected'].includes(status)) {
    return error('状态值无效', ErrorCodes.BAD_REQUEST)
  }

  const [pet] = await db.select().from(pets).where(eq(pets.id, id)).limit(1)

  if (!pet) {
    return error('宠物不存在', ErrorCodes.PET_NOT_FOUND)
  }

  await db.update(pets)
    .set({
      status: status as any,
      updatedAt: new Date(),
    })
    .where(eq(pets.id, id))

  return success(null, status === 'available' ? '已通过审核' : '已拒绝')
})
