import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { adoptions, pets } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const id = event.url.pathname.split('/').filter(Boolean).pop()

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
    return error('无权限查看', ErrorCodes.FORBIDDEN)
  }

  const [pet] = await db
    .select({
      id: pets.id,
      name: pets.name,
      species: pets.species,
      breed: pets.breed,
      city: pets.city,
    })
    .from(pets)
    .where(eq(pets.id, adoption.petId))
    .limit(1)

  return success({
    ...adoption,
    pet,
  })
})
