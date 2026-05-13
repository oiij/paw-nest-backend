import { index, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { defaultUUID, targetTypeEnum } from './common'
import { users } from './user'

export const favorites = pgTable('favorites', {
  id: defaultUUID,
  serialId: serial('serial_id'),
  userId: varchar('user_id', { length: 21 }).references(() => users.id).notNull(),
  targetType: targetTypeEnum('target_type').notNull(),
  targetId: varchar('target_id', { length: 21 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  userTargetUnique: uniqueIndex('favorites_user_target_idx').on(
    table.userId,
    table.targetType,
    table.targetId,
  ),
  userIdx: index('favorites_user_idx').on(table.userId, table.targetType),
}))
