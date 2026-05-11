import { and, count, desc, eq, sql } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { petImages, pets, petTags, users } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const query = event.url.searchParams

  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 10
  const species = query.get('species')
  const city = query.get('city')
  const gender = query.get('gender')
  const status = query.get('status') || 'available'
  const keyword = query.get('keyword')

  const conditions = []

  if (species) {
    conditions.push(eq(pets.species, species as any))
  }
  if (city) {
    conditions.push(eq(pets.city, city))
  }
  if (gender) {
    conditions.push(eq(pets.gender, gender as any))
  }
  if (status) {
    conditions.push(eq(pets.status, status as any))
  }
  if (keyword) {
    conditions.push(
      sql`${pets.name} LIKE ${`%${keyword}%`} OR ${pets.description} LIKE ${`%${keyword}%`}`,
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [totalResult] = await db
    .select({ value: count() })
    .from(pets)
    .where(where)

  const list = await db
    .select({
      id: pets.id,
      name: pets.name,
      species: pets.species,
      breed: pets.breed,
      age: pets.age,
      gender: pets.gender,
      city: pets.city,
      status: pets.status,
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
    .where(where)
    .orderBy(desc(pets.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

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

  return success({
    list: result,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
