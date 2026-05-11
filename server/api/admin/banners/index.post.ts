import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { number, object, optional, string } from 'zod'
import { db } from '~/db'
import { banners } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  title: string().min(1).max(100),
  image: string(),
  link: optional(string()),
  linkType: optional(string()),
  sort: optional(number()),
  startTime: optional(string()),
  endTime: optional(string()),
})

export default defineHandler(async (event) => {
  const role = event.context._role

  if (role !== 'admin') {
    return error('无权限', ErrorCodes.FORBIDDEN)
  }

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data
  const id = nanoid(21)
  const now = new Date()

  await db.insert(banners).values({
    id,
    title: data.title,
    image: data.image,
    link: data.link,
    linkType: data.linkType as any,
    sort: data.sort ?? 0,
    startTime: data.startTime ? new Date(data.startTime) : null,
    endTime: data.endTime ? new Date(data.endTime) : null,
    createdAt: now,
    updatedAt: now,
  })

  return success({ id }, '创建成功')
})
