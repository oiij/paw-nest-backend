import { and, count, desc, eq, sql } from 'drizzle-orm'
import { defineHandler } from 'nitro'
import { db } from '~/db'
import { postImages, posts, postTags, users } from '~/db/schema'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const query = event.url.searchParams

  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 10
  const type = query.get('type')
  const keyword = query.get('keyword')

  const conditions = [eq(posts.status, 'published')]

  if (type) {
    conditions.push(eq(posts.type, type as any))
  }
  if (keyword) {
    conditions.push(
      sql`${posts.title} LIKE ${`%${keyword}%`} OR ${posts.content} LIKE ${`%${keyword}%`}`,
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [totalResult] = await db
    .select({ value: count() })
    .from(posts)
    .where(where)

  const list = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      type: posts.type,
      location: posts.location,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      favoriteCount: posts.favoriteCount,
      viewCount: posts.viewCount,
      createdAt: posts.createdAt,
      user: {
        id: users.id,
        nickname: users.nickname,
        avatar: users.avatar,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(where)
    .orderBy(desc(posts.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const postIds = list.map(p => p.id)
  const images = postIds.length > 0
    ? await db.select().from(postImages).where(sql`${postImages.postId} IN ${postIds}`)
    : []
  const tags = postIds.length > 0
    ? await db.select().from(postTags).where(sql`${postTags.postId} IN ${postIds}`)
    : []

  const result = list.map(post => ({
    ...post,
    images: images.filter(img => img.postId === post.id).map(img => ({ url: img.url, type: img.type })),
    tags: tags.filter(tag => tag.postId === post.id).map(tag => tag.name),
  }))

  return success({
    list: result,
    total: totalResult?.value || 0,
    page,
    pageSize,
  })
})
