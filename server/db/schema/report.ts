import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { targetTypeEnum } from './common'
import { users } from './user'

export const reportStatusEnum = pgEnum('report_status', ['pending', 'resolved', 'dismissed'])

export const reports = pgTable('reports', {
  id: varchar('id', { length: 21 }).primaryKey(),
  reporterId: varchar('reporter_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  targetType: targetTypeEnum('target_type').notNull(),
  targetId: varchar('target_id', { length: 21 }).notNull(),
  reason: text('reason').notNull(),
  status: reportStatusEnum('status').default('pending').notNull(),
  handlerId: varchar('handler_id', { length: 21 }),
  handleNote: text('handle_note'),
  handledAt: timestamp('handled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  statusIdx: index('reports_status_idx').on(table.status),
  targetIdx: index('reports_target_idx').on(table.targetType, table.targetId),
}))
