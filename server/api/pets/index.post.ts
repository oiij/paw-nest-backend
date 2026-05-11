import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { array, boolean, number, object, optional, string } from 'zod'
import { db } from '~/db'
import { petImages, pets, petTags } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  name: string().min(1).max(50),
  species: string(),
  breed: optional(string().max(50)),
  age: optional(number()),
  gender: string(),
  weight: optional(number()),
  color: optional(string().max(30)),
  city: string().max(50),
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

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data
  const petId = nanoid(21)
  const now = new Date()

  await db.insert(pets).values({
    id: petId,
    name: data.name,
    species: data.species as any,
    breed: data.breed,
    age: data.age,
    gender: data.gender as any,
    weight: data.weight,
    color: data.color,
    city: data.city,
    district: data.district,
    description: data.description,
    healthStatus: data.healthStatus,
    vaccinated: data.vaccinated ?? false,
    dewormed: data.dewormed ?? false,
    sterilized: data.sterilized ?? false,
    publisherId: userId,
    createdAt: now,
    updatedAt: now,
  })

  if (data.images && data.images.length > 0) {
    await db.insert(petImages).values(
      data.images.map((url, index) => ({
        id: nanoid(21),
        url,
        sort: index,
        petId,
        createdAt: now,
      })),
    )
  }

  if (data.tags && data.tags.length > 0) {
    await db.insert(petTags).values(
      data.tags.map(name => ({
        id: nanoid(21),
        name,
        petId,
      })),
    )
  }

  return success({ id: petId }, '发布成功')
})
