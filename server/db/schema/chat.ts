import { boolean, index, pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { chatMessageTypeEnum, defaultUUID } from './common'
import { users } from './user'

export const chatRooms = pgTable('chat_rooms', {
  id: defaultUUID,
  serialId: serial('serial_id'),
  user1Id: varchar('user1_id', { length: 21 }).references(() => users.id).notNull(),
  user2Id: varchar('user2_id', { length: 21 }).references(() => users.id).notNull(),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  usersUnique: uniqueIndex('chat_rooms_users_idx').on(table.user1Id, table.user2Id),
}))

export const chatMessages = pgTable('chat_messages', {
  id: defaultUUID,
  roomId: varchar('room_id', { length: 21 }).references(() => chatRooms.id).notNull(),
  senderId: varchar('sender_id', { length: 21 }).references(() => users.id).notNull(),
  type: chatMessageTypeEnum('type').default('text').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  roomCreatedIdx: index('chat_messages_room_created_idx').on(table.roomId, table.createdAt),
}))
