import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { array, boolean, number, object, optional, string } from 'zod'
import { db } from '~/db'
import { petImages, pets, petTags } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  name: optional(string().min(1).max(50)),
  species: optional(string()),
  breed: optional(string().max(50)),
  age: optional(number()),
  gender: optional(string()),
  weight: optional(number()),
  color: optional(string().max(30)),
  city: optional(string().max(50)),
  district: optional(string().max(50)),
  description: optional(string()),
  healthStatus: optional(string().max(100)),
  vaccinated: optional(boolean()),
  dewormed: optional(boolean()),
  sterilized: optional(boolean()),
  tags: optional(array(string())),
  images: optional(array(string())),
})

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
    return error('无权限修改', ErrorCodes.FORBIDDEN)
  }

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data

  await db.update(pets)
    .set({
      ...data,
      species: data.species as any,
      gender: data.gender as any,
      updatedAt: new Date(),
    })
    .where(eq(pets.id, id))

  if (data.images) {
    await db.delete(petImages).where(eq(petImages.petId, id))
    if (data.images.length > 0) {
      await db.insert(petImages).values(
        data.images.map((url, index) => ({
          id: nanoid(21),
          url,
          sort: index,
          petId: id,
          createdAt: new Date(),
        })),
      )
    }
  }

  if (data.tags) {
    await db.delete(petTags).where(eq(petTags.petId, id))
    if (data.tags.length > 0) {
      await db.insert(petTags).values(
        data.tags.map(name => ({
          id: nanoid(21),
          name,
          petId: id,
        })),
      )
    }
  }

  return success(null, '更新成功')
})
