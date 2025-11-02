# Drizzle ORM - Simple Guide 🌧️

## What is Drizzle ORM? (In Plain English)

Think of your database like a big filing cabinet with drawers full of papers (your data). 

**Without Drizzle**: You have to write complicated instructions like "Go to drawer 3, folder 5, find paper with ID 123, read line 4" every single time.

**With Drizzle**: You create a **map** of your filing cabinet once, then just say things like "get user 123" and Drizzle knows exactly where to look and what to do.

**Drizzle ORM** = A translator that helps your code talk to the database in a simpler way.

---

## How It Works with Supabase

You're using **two different ways** to talk to your database:

### 1. Supabase Client (what you already have)
- **Where**: `app/supabaseClient.ts`
- **What it does**: Like using a remote control - simple commands but less flexible
- **Used for**: Authentication, simple data fetching
- **Example**: "Is the user logged in?"

### 2. Drizzle ORM (the new tool)
- **Where**: `lib/db/index.ts` and `lib/db/schema.ts`
- **What it does**: Like having a personal assistant who knows your entire filing system
- **Used for**: Complex queries, type-safe database operations, better control
- **Example**: "Get all users who spent more than $50 last month, sorted by date"

**Think of it this way**: Supabase Client is like a smartphone app (easy but limited), while Drizzle is like having a database expert sitting next to you (more powerful, more control).

---

## The Files You Have

### 1. `lib/db/index.ts` - The Connection
This is like dialing the phone number to reach your database.

```typescript
// This file says: "Hey database, I want to connect to you!"
export const db = drizzle(client);
```

**You don't need to edit this** - it just sets up the connection.

---

### 2. `lib/db/schema.ts` - The Map
This is like a **blueprint** of your database. It tells Drizzle:
- What tables you have
- What columns are in each table
- What types of data go in each column

**Example**:
```typescript
export const userData = pgTable('user_data', {
  userId: uuid('user_id').primaryKey(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  userPoints: integer('user_points').default(0),
  // ... etc
});
```

This says: "Hey Drizzle, I have a table called `user_data` with these columns..."

---

### 3. `drizzle.config.ts` - The Settings
This tells Drizzle where to find your schema file and how to connect.

**You don't need to edit this** - it just points Drizzle in the right direction.

---

## How to Use It (Step by Step)

### Step 1: Set Up Your Environment
In your `.env.local` file, make sure you have:

```env
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres
```

**Where to get this**: 
1. Go to your Supabase project
2. Settings → Database
3. Copy the "Connection string" (Session mode)

---

### Step 2: Create Your Database Tables

You have two options:

#### Option A: Use Drizzle (Recommended for New Setup)
```bash
npx drizzle-kit push
```

This reads your `schema.ts` file and creates the tables in your database automatically.

#### Option B: Use SQL (If Tables Already Exist)
Copy the SQL from `DATABASE_SCHEMA.md` and run it in Supabase SQL Editor.

---

### Step 3: Use Drizzle in Your Code

#### Example 1: Get All Users
```typescript
import { db } from '@/lib/db';
import { userData } from '@/lib/db/schema';

// Get all users
const users = await db.select().from(userData);
console.log(users); // Shows all users!
```

**Translation**: "Hey database, give me everything from the user_data table"

---

#### Example 2: Get One User by ID
```typescript
import { db } from '@/lib/db';
import { userData } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Get one specific user
const user = await db
  .select()
  .from(userData)
  .where(eq(userData.userId, 'some-user-id'))
  .limit(1);

console.log(user); // Shows that one user!
```

**Translation**: "Hey database, give me the user where the user_id equals 'some-user-id'"

---

#### Example 3: Create a New Grocery Plan
```typescript
import { db } from '@/lib/db';
import { groceryHistory } from '@/lib/db/schema';

// Create a new grocery plan
const newPlan = await db.insert(groceryHistory).values({
  userId: 'user-123',
  prompt: 'Weekly meal prep',
  groceries: [
    { name: 'Tomatoes', price: 5.99 },
    { name: 'Cheese', price: 7.49 }
  ],
  budget: 50.00,
  goals: []
}).returning();

console.log(newPlan); // Shows the newly created plan!
```

**Translation**: "Hey database, create a new grocery plan with this data, then give it back to me"

---

#### Example 4: Update User Points
```typescript
import { db } from '@/lib/db';
import { userData } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Update a user's points
await db
  .update(userData)
  .set({ userPoints: 5000 })
  .where(eq(userData.userId, 'user-123'));
```

**Translation**: "Hey database, find the user with ID 'user-123' and change their points to 5000"

---

## Real-World Example: Updating Your Code

Let's say you want to replace the Supabase query in `app/data/dataStore.ts` with Drizzle:

### Before (Using Supabase):
```typescript
const { data, error } = await supabase
  .from('grocery_history')
  .select('*')
  .eq('user_id', userId);
```

### After (Using Drizzle):
```typescript
import { db } from '@/lib/db';
import { groceryHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const plans = await db
  .select()
  .from(groceryHistory)
  .where(eq(groceryHistory.userId, userId));
```

**Benefits**:
- ✅ Type-safe (TypeScript knows exactly what data you're getting)
- ✅ Better autocomplete in your editor
- ✅ Easier to write complex queries
- ✅ Catches errors before you run the code

---

## Common Questions

### Q: Do I have to use Drizzle everywhere?
**A**: No! You can use both:
- **Supabase Client** for simple stuff (auth, quick queries)
- **Drizzle** for complex queries or when you want type safety

### Q: Can I still use Supabase Client?
**A**: Yes! They work together. Use:
- Supabase Client → Authentication, real-time features
- Drizzle → Complex database queries

### Q: What if my database structure changes?
**A**: 
1. Update `lib/db/schema.ts`
2. Run `npx drizzle-kit generate` (creates migration files)
3. Run `npx drizzle-kit push` (applies changes to database)

### Q: Why are there two ways to connect?
**A**: 
- `NEXT_PUBLIC_SUPABASE_URL` → For Supabase Client (browser + server)
- `DATABASE_URL` → For Drizzle (direct database connection, server-only)

---

## Quick Reference

### Import Drizzle
```typescript
import { db } from '@/lib/db';              // The database connection
import { userData } from '@/lib/db/schema'; // Your table definitions
import { eq, desc } from 'drizzle-orm';     // Helper functions
```

### Common Operations

**Select (Get data)**
```typescript
const items = await db.select().from(itemTable);
```

**Select with condition**
```typescript
const user = await db
  .select()
  .from(userData)
  .where(eq(userData.userId, userId));
```

**Insert (Add data)**
```typescript
await db.insert(groceryHistory).values({ ... });
```

**Update (Change data)**
```typescript
await db.update(userData).set({ userPoints: 1000 });
```

**Delete (Remove data)**
```typescript
await db.delete(groceryHistory).where(eq(groceryHistory.id, planId));
```

---

## Next Steps

1. **Set up your `.env.local`** with `DATABASE_URL`
2. **Run migrations**: `npx drizzle-kit push`
3. **Try a simple query** - see `lib/db/example-usage.ts` for examples
4. **Gradually replace** Supabase queries with Drizzle when you need more control

---

**Remember**: Drizzle is just a tool to make talking to your database easier. Start simple, experiment, and you'll get the hang of it! 🚀

