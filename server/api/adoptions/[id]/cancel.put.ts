import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { adoptions } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).slice(0, -1).pop()

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [adoption] = await db
    .select()
    .from(adoptions)
    .where(eq(adoptions.id, id))
    .limit(1)

  if (!adoption) {
    return error('申请不存在', ErrorCodes.NOT_FOUND)
  }

  if (adoption.userId !== userId) {
    return error('无权限操作', ErrorCodes.FORBIDDEN)
  }

  if (!['pending', 'reviewing'].includes(adoption.status)) {
    return error('当前状态无法取消', ErrorCodes.ADOPTION_STATUS_ERROR)
  }

  await db.update(adoptions)
    .set({
      status: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(adoptions.id, id))

  return success(null, '已取消申请')
})
