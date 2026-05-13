import { index, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { bannerStatusEnum, defaultUUID, linkTypeEnum } from './common'

export const banners = pgTable('banners', {
  id: defaultUUID,
  serialId: serial('serial_id'),
  title: varchar('title', { length: 100 }).notNull(),
  image: text('image').notNull(),
  link: text('link'),
  linkType: linkTypeEnum('link_type'),
  sort: integer('sort').default(0).notNull(),
  status: bannerStatusEnum('status').default('active').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  statusSortIdx: index('banners_status_sort_idx').on(table.status, table.sort),
}))
