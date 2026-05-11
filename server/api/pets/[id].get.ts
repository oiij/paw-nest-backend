import { eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { petImages, pets, petTags, users } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
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

  await db.update(pets)
    .set({ viewCount: pet.viewCount + 1 })
    .where(eq(pets.id, id))

  const [publisher] = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, pet.publisherId))
    .limit(1)

  const images = await db
    .select()
    .from(petImages)
    .where(eq(petImages.petId, id))

  const tags = await db
    .select()
    .from(petTags)
    .where(eq(petTags.petId, id))

  return success({
    ...pet,
    publisher,
    images: images.map(img => ({ url: img.url })),
    tags: tags.map(tag => tag.name),
  })
})
