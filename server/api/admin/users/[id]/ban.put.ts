import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { users } from '~/db/schema'
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

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

  if (!user) {
    return error('用户不存在', ErrorCodes.USER_NOT_FOUND)
  }

  if (user.role === 'admin') {
    return error('无法封禁管理员', ErrorCodes.FORBIDDEN)
  }

  const newStatus = user.status === 'banned' ? 'active' : 'banned'

  await db.update(users)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))

  return success(null, newStatus === 'banned' ? '已封禁' : '已解封')
})
