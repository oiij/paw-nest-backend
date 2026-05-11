import { count, eq } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { adoptions, pets, posts } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const [petCount] = await db
    .select({ value: count() })
    .from(pets)
    .where(eq(pets.publisherId, userId))

  const [postCount] = await db
    .select({ value: count() })
    .from(posts)
    .where(eq(posts.userId, userId))

  const [adoptionCount] = await db
    .select({ value: count() })
    .from(adoptions)
    .where(eq(adoptions.userId, userId))

  return success({
    petCount: petCount?.value || 0,
    postCount: postCount?.value || 0,
    adoptionCount: adoptionCount?.value || 0,
  })
})
