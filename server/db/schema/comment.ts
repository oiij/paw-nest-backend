import { index, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { commentStatusEnum, defaultUUID } from './common'
import { posts } from './post'
import { users } from './user'

export const comments = pgTable('comments', {
  id: defaultUUID,
  serialId: serial('serial_id'),
  userId: varchar('user_id', { length: 21 }).references(() => users.id).notNull(),
  postId: varchar('post_id', { length: 21 }).references(() => posts.id).notNull(),
  parentId: varchar('parent_id', { length: 21 }),
  content: text('content').notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  status: commentStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  postCreatedIdx: index('comments_post_created_idx').on(table.postId, table.createdAt),
}))
