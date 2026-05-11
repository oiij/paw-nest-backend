import { desc, eq, sql } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { adoptions, petImages, pets } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const query = event.url.searchParams

  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 10
  const status = query.get('status')

  const conditions = [eq(adoptions.userId, userId)]
  if (status) {
    conditions.push(eq(adoptions.status, status as any))
  }

  const where = sql`${conditions.reduce((acc, cur) => sql`${acc} AND ${cur}`)}`

  const list = await db
    .select({
      id: adoptions.id,
      status: adoptions.status,
      applicantName: adoptions.applicantName,
      createdAt: adoptions.createdAt,
      pet: {
        id: pets.id,
        name: pets.name,
        species: pets.species,
        city: pets.city,
      },
    })
    .from(adoptions)
    .leftJoin(pets, eq(adoptions.petId, pets.id))
    .where(where)
    .orderBy(desc(adoptions.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const petIds = list.map(a => a.pet?.id).filter(Boolean) as string[]
  const images = petIds.length > 0
    ? await db.select().from(petImages).where(sql`${petImages.petId} IN ${petIds}`)
    : []

  const result = list.map(adoption => ({
    ...adoption,
    pet: adoption.pet
      ? {
          ...adoption.pet,
          image: images.find(img => img.petId === adoption.pet?.id)?.url || null,
        }
      : null,
  }))

  return success({
    list: result,
    page,
    pageSize,
  })
})
