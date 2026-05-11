import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { pets } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const id = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [pet] = await db.select().from(pets).where(eq(pets.id, id)).limit(1)

  if (!pet) {
    return error('宠物不存在', ErrorCodes.PET_NOT_FOUND)
  }

  await db.update(pets)
    .set({
      status: 'offline',
      updatedAt: new Date(),
    })
    .where(eq(pets.id, id))

  return success(null, '已下架')
})
