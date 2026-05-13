import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import { roleEnum, userStatusEnum } from './common'

export const users = pgTable('users', {
  id: varchar('id', { length: 21 }).primaryKey().$defaultFn(() => nanoid()),
  uuid: text('uuid').$defaultFn(() => `uuid_${nanoid()}`).notNull().unique(),
  openId: varchar('open_id', { length: 64 }).notNull().unique(),
  unionId: varchar('union_id', { length: 64 }),
  phone: varchar('phone', { length: 20 }).unique(),
  nickname: varchar('nickname', { length: 50 }).notNull(),
  avatar: text('avatar'),
  gender: varchar('gender', { length: 10 }).default('unknown'),
  city: varchar('city', { length: 50 }),
  bio: text('bio'),
  role: roleEnum('role').default('user').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  phoneIdx: index('users_phone_idx').on(table.phone),
  cityIdx: index('users_city_idx').on(table.city),
}))
