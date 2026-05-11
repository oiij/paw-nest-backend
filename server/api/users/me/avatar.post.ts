import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const formData = await event.req.formData()
  const file = formData.get('avatar') as File | null

  if (!file) {
    return error('请选择图片', ErrorCodes.BAD_REQUEST)
  }

  const avatarUrl = `https://cdn.example.com/avatars/${userId}.jpg`

  await db.update(users)
    .set({
      avatar: avatarUrl,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return success({ avatar: avatarUrl })
})
