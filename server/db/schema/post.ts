import { index, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { defaultUUID, postStatusEnum, postTypeEnum } from './common'
import { users } from './user'

export const posts = pgTable('posts', {
  id: defaultUUID,
  serialId: serial('serial_id'),
  userId: varchar('user_id', { length: 21 }).references(() => users.id).notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content').notNull(),
  type: postTypeEnum('type').default('dynamic').notNull(),
  location: varchar('location', { length: 100 }),
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  favoriteCount: integer('favorite_count').default(0).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  status: postStatusEnum('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  userCreatedIdx: index('posts_user_created_idx').on(table.userId, table.createdAt),
  typeStatusIdx: index('posts_type_status_idx').on(table.type, table.status),
}))

export const postImages = pgTable('post_images', {
  id: defaultUUID,
  url: text('url').notNull(),
  type: varchar('type', { length: 10 }).default('image').notNull(),
  sort: integer('sort').default(0).notNull(),
  postId: varchar('post_id', { length: 21 })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const postTags = pgTable('post_tags', {
  id: defaultUUID,
  name: varchar('name', { length: 30 }).notNull(),
  postId: varchar('post_id', { length: 21 })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
}, table => ({
  namePostUnique: index('post_tags_name_post_idx').on(table.name, table.postId),
}))
