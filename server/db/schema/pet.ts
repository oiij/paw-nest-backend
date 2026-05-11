import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { petGenderEnum, petStatusEnum, speciesEnum } from './common'
import { users } from './user'

export const pets = pgTable('pets', {
  id: varchar('id', { length: 21 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  species: speciesEnum('species').notNull(),
  breed: varchar('breed', { length: 50 }),
  age: integer('age'),
  gender: petGenderEnum('gender').notNull(),
  weight: real('weight'),
  color: varchar('color', { length: 30 }),
  city: varchar('city', { length: 50 }).notNull(),
  district: varchar('district', { length: 50 }),
  description: text('description'),
  healthStatus: varchar('health_status', { length: 100 }),
  vaccinated: boolean('vaccinated').default(false).notNull(),
  dewormed: boolean('dewormed').default(false).notNull(),
  sterilized: boolean('sterilized').default(false).notNull(),
  status: petStatusEnum('status').default('pending').notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  adoptFee: integer('adopt_fee'),
  publisherId: varchar('publisher_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  speciesStatusIdx: index('pets_species_status_idx').on(table.species, table.status),
  cityStatusIdx: index('pets_city_status_idx').on(table.city, table.status),
  publisherIdx: index('pets_publisher_idx').on(table.publisherId),
}))

export const petImages = pgTable('pet_images', {
  id: varchar('id', { length: 21 }).primaryKey(),
  url: text('url').notNull(),
  sort: integer('sort').default(0).notNull(),
  petId: varchar('pet_id', { length: 21 })
    .references(() => pets.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const petTags = pgTable('pet_tags', {
  id: varchar('id', { length: 21 }).primaryKey(),
  name: varchar('name', { length: 30 }).notNull(),
  petId: varchar('pet_id', { length: 21 })
    .references(() => pets.id, { onDelete: 'cascade' })
    .notNull(),
}, table => ({
  namePetUnique: uniqueIndex('pet_tags_name_pet_id_idx').on(table.name, table.petId),
}))
