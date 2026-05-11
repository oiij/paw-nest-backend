import { and, count, desc, eq, sql } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { favorites, petImages, pets, postImages, posts } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId
  const query = event.url.searchParams

  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 10
  const targetType = query.get('type') || 'pet'

  const where = and(
    eq(favorites.userId, userId),
    eq(favorites.targetType, targetType as any),
  )

  const [totalResult] = await db
    .select({ value: count() })
    .from(favorites)
    .where(where)

  const list = await db
    .select({
      id: favorites.id,
      targetId: favorites.targetId,
      createdAt: favorites.createdAt,
    })
    .from(favorites)
    .where(where)
    .orderBy(desc(favorites.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const targetIds = list.map(f => f.targetId)

  let items: any[] = []

  if (targetType === 'pet' && targetIds.length > 0) {
    const petList = await db
      .select({
        id: pets.id,
        name: pets.name,
        species: pets.species,
        city: pets.city,
        status: pets.status,
      })
      .from(pets)
      .where(sql`${pets.id} IN ${targetIds}`)

    const images = await db
      .select()
      .from(petImages)
      .where(sql`${petImages.petId} IN ${targetIds}`)

    items = list.map((fav) => {
      const pet = petList.find(p => p.id === fav.targetId)
      return {
        favoriteId: fav.id,
        createdAt: fav.createdAt,
        pet: pet
          ? {
              ...pet,
              image: images.find(img => img.petId === pet.id)?.url || null,
            }
          : null,
      }
    })
  }
  else if (targetType === 'post' && targetIds.length > 0) {
    const postList = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        type: posts.type,
      })
      .from(posts)
      .where(sql`${posts.id} IN ${targetIds}`)

    const images = await db
      .select()
      .from(postImages)
      .where(sql`${postImages.postId} IN ${targetIds}`)

    items = list.map((fav) => {
      const post = postList.find(p => p.id === fav.targetId)
      return {
        favoriteId: fav.id,
        createdAt: fav.createdAt,
        post: post
          ? {
              ...post,
              image: images.find(img => img.postId === post.id)?.url || null,
            }
          : null,
      }
    })
  }

  return success({
    list: items,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
