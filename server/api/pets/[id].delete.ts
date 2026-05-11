import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { pets } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [pet] = await db
    .select()
    .from(pets)
    .where(eq(pets.id, id))
    .limit(1)

  if (!pet) {
    return error('宠物不存在', ErrorCodes.PET_NOT_FOUND)
  }

  if (pet.publisherId !== userId) {
    return error('无权限删除', ErrorCodes.FORBIDDEN)
  }

  await db.delete(pets).where(eq(pets.id, id))

  return success(null, '删除成功')
})
