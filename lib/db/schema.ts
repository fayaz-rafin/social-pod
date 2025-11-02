import { pgTable, uuid, varchar, integer, numeric, jsonb, timestamp } from 'drizzle-orm/pg-core';

// User data table
// Note: user_id references auth.users.id (managed by Supabase Auth, not defined in this schema)
export const userData = pgTable('user_data', {
  userId: uuid('user_id').primaryKey(), // References auth.users.id (Supabase managed)
  userName: varchar('user_name', { length: 255 }).notNull(),
  userPoints: integer('user_points').default(0),
  userLists: jsonb('user_lists').default([]),
  userGoals: jsonb('user_goals').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Item table (product catalog)
export const itemTable = pgTable('item_table', {
  itemId: integer('item_id').primaryKey().generatedAlwaysAsIdentity(),
  itemName: varchar('item_name', { length: 255 }).notNull(),
  itemPrice: numeric('item_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Grocery history table
// Note: user_id references auth.users.id (managed by Supabase Auth, not defined in this schema)
export const groceryHistory = pgTable('grocery_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References auth.users.id (Supabase managed)
  prompt: varchar('prompt', { length: 1000 }).notNull(),
  groceries: jsonb('groceries').notNull().default([]),
  budget: numeric('budget', { precision: 10, scale: 2 }).notNull(),
  goals: jsonb('goals'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Broccoli Pet table
export const petTable = pgTable('pet_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(), // One pet per user
  petName: varchar('pet_name', { length: 100 }).default('Broccoli'),
  petType: varchar('pet_type', { length: 50 }).default('broccoli'),
  
  // State
  hearts: integer('hearts').default(6).notNull(),
  maxHearts: integer('max_hearts').default(6).notNull(),
  level: integer('level').default(0),
  experience: integer('experience').default(0),
  
  // Care tracking
  lastFedAt: timestamp('last_fed_at'),
  lastWateredAt: timestamp('last_watered_at'),
  lastFertilizedAt: timestamp('last_fertilized_at'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});



