import { desc, eq, sql } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { petImages, pets, petTags, users } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const city = event.url.searchParams.get('city')
  const limit = Number(event.url.searchParams.get('limit')) || 10

  const conditions = [eq(pets.status, 'available')]

  if (city) {
    conditions.push(eq(pets.city, city))
  }

  const list = await db
    .select({
      id: pets.id,
      name: pets.name,
      species: pets.species,
      breed: pets.breed,
      age: pets.age,
      gender: pets.gender,
      city: pets.city,
      viewCount: pets.viewCount,
      createdAt: pets.createdAt,
      publisher: {
        id: users.id,
        nickname: users.nickname,
        avatar: users.avatar,
      },
    })
    .from(pets)
    .leftJoin(users, eq(pets.publisherId, users.id))
    .where(sql`${conditions.reduce((acc, cur) => sql`${acc} AND ${cur}`)}`)
    .orderBy(desc(pets.createdAt))
    .limit(limit)

  const petIds = list.map(p => p.id)
  const images = petIds.length > 0
    ? await db.select().from(petImages).where(sql`${petImages.petId} IN ${petIds}`)
    : []
  const tags = petIds.length > 0
    ? await db.select().from(petTags).where(sql`${petTags.petId} IN ${petIds}`)
    : []

  const result = list.map(pet => ({
    ...pet,
    images: images.filter(img => img.petId === pet.id).map(img => ({ url: img.url })),
    tags: tags.filter(tag => tag.petId === pet.id).map(tag => tag.name),
  }))

  return success(result)
})
