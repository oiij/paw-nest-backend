import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { messageTypeEnum } from './common'
import { users } from './user'

export const messages = pgTable('messages', {
  id: varchar('id', { length: 21 }).primaryKey(),
  senderId: varchar('sender_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  receiverId: varchar('receiver_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  type: messageTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  receiverReadIdx: index('messages_receiver_read_idx').on(table.receiverId, table.isRead, table.createdAt),
}))
