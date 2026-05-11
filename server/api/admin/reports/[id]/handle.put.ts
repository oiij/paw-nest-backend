import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { object, optional, string } from 'zod'
import { db } from '~/db'
import { reports } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  status: string(),
  handleNote: optional(string()),
})

export default defineHandler(async (event) => {
  const role = event.context._role
  const userId = event.context._userId

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

  const { status, handleNote } = body.data

  if (!['resolved', 'dismissed'].includes(status)) {
    return error('状态值无效', ErrorCodes.BAD_REQUEST)
  }

  const [report] = await db.select().from(reports).where(eq(reports.id, id)).limit(1)

  if (!report) {
    return error('举报不存在', ErrorCodes.NOT_FOUND)
  }

  await db.update(reports)
    .set({
      status: status as any,
      handlerId: userId,
      handleNote,
      handledAt: new Date(),
    })
    .where(eq(reports.id, id))

  return success(null, status === 'resolved' ? '已处理' : '已驳回')
})
