import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { adoptionStatusEnum, housingTypeEnum } from './common'
import { pets } from './pet'
import { users } from './user'

export const adoptions = pgTable('adoptions', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  petId: varchar('pet_id', { length: 21 })
    .references(() => pets.id)
    .notNull(),
  status: adoptionStatusEnum('status').default('pending').notNull(),
  applicantName: varchar('applicant_name', { length: 50 }).notNull(),
  applicantAge: integer('applicant_age').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  wechat: varchar('wechat', { length: 50 }),
  city: varchar('city', { length: 50 }).notNull(),
  housingType: housingTypeEnum('housing_type').notNull(),
  hasPetExp: boolean('has_pet_exp').default(false).notNull(),
  acceptSterilize: boolean('accept_sterilize').default(true).notNull(),
  dailyCareTime: integer('daily_care_time'),
  familyAgree: boolean('family_agree').default(true).notNull(),
  allergy: boolean('allergy').default(false).notNull(),
  reason: text('reason'),
  reviewerId: varchar('reviewer_id', { length: 21 }),
  reviewNote: text('review_note'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  userPetUnique: uniqueIndex('adoptions_user_pet_idx').on(table.userId, table.petId),
  petStatusIdx: index('adoptions_pet_status_idx').on(table.petId, table.status),
}))
