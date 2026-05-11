import { desc, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { adoptions, pets, users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const petId = event.url.pathname.split('/').pop()

  if (!petId) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const [pet] = await db
    .select()
    .from(pets)
    .where(eq(pets.id, petId))
    .limit(1)

  if (!pet) {
    return error('宠物不存在', ErrorCodes.PET_NOT_FOUND)
  }

  if (pet.publisherId !== userId) {
    return error('无权限查看', ErrorCodes.FORBIDDEN)
  }

  const list = await db
    .select({
      id: adoptions.id,
      status: adoptions.status,
      applicantName: adoptions.applicantName,
      applicantAge: adoptions.applicantAge,
      phone: adoptions.phone,
      city: adoptions.city,
      housingType: adoptions.housingType,
      reason: adoptions.reason,
      createdAt: adoptions.createdAt,
      user: {
        id: users.id,
        nickname: users.nickname,
        avatar: users.avatar,
      },
    })
    .from(adoptions)
    .leftJoin(users, eq(adoptions.userId, users.id))
    .where(eq(adoptions.petId, petId))
    .orderBy(desc(adoptions.createdAt))

  return success(list)
})
