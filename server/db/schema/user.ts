import { index, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { defaultUUID, roleEnum, userStatusEnum } from './common'

export const users = pgTable('users', {
  id: defaultUUID,
  serialId: serial('serial_id'),
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
