/**
 * Example usage of Drizzle ORM with Supabase
 * 
 * This file shows how to use Drizzle to query your database tables.
 * Import the db instance and schema from this directory.
 */

import { db } from './index';
import { userData, itemTable, groceryHistory } from './schema';
import { eq, desc } from 'drizzle-orm';

// Example: Get user by ID
export async function getUserByUserId(userId: string) {
  const user = await db
    .select()
    .from(userData)
    .where(eq(userData.userId, userId))
    .limit(1);
  
  return user[0] || null;
}

// Example: Get all items
export async function getAllItems() {
  const items = await db.select().from(itemTable);
  return items;
}

// Example: Get grocery history for a user (most recent first)
export async function getGroceryHistoryByUserId(userId: string) {
  const history = await db
    .select()
    .from(groceryHistory)
    .where(eq(groceryHistory.userId, userId))
    .orderBy(desc(groceryHistory.createdAt));
  
  return history;
}

// Example: Insert a new grocery plan
export async function insertGroceryPlan(data: {
  userId: string;
  prompt: string;
  groceries: any[];
  budget: number;
  goals?: any[];
}) {
  const [newPlan] = await db
    .insert(groceryHistory)
    .values({
      userId: data.userId,
      prompt: data.prompt,
      groceries: data.groceries,
      budget: data.budget.toString(), // Convert to string for numeric type
      goals: data.goals,
    })
    .returning();
  
  return newPlan;
}

// Example: Update user points
export async function updateUserPoints(userId: string, newPoints: number) {
  const [updated] = await db
    .update(userData)
    .set({ userPoints: newPoints })
    .where(eq(userData.userId, userId))
    .returning();
  
  return updated;
}

