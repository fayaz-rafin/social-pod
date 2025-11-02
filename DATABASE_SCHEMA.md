# Database Schema Documentation

This document describes the Supabase database schema as inferred from the codebase. Since the database is currently down, this schema has been reconstructed from code analysis.

## Tables Overview

Based on the codebase analysis, the database contains the following tables:

1. **user_data** - User profile and settings data
2. **item_table** - Product catalog with items and prices
3. **grocery_history** - Saved grocery plans and shopping history
4. **auth.users** - Supabase Auth managed users table (standard Supabase table)

---

## Table: `user_data`

**Purpose**: Stores user profile data and preferences

**Location in Code**: `app/data/dataStore.ts` - `getUserById()`

**Fields** (inferred from TypeScript interface):

```typescript
interface User {
  user_id: string;        // Primary key, matches auth.users.id
  user_name: string;      // Display name
  user_points: number;    // User's points/nutrients balance
  user_lists: ListItem[]; // Array of grocery lists with budget info
  user_goals: string[];  // Array of goal identifiers
}
```

**Fields Details**:
- `user_id` (string): Primary key, references `auth.users.id`
- `user_name` (string): User's display name
- `user_points` (number): Current points/nutrients balance
- `user_lists` (JSONB array): Array of ListItem objects containing:
  - `budget` (number): Budget for the list
  - `grocer_list` (string[]): Array of grocery item names
  - `total_spending` (number): Total amount spent
- `user_goals` (string[]): Array of goal identifiers or descriptions

**Queries**:
- `SELECT * FROM user_data WHERE user_id = $1` (single row)

---

## Table: `item_table`

**Purpose**: Product catalog with item information and prices

**Location in Code**: `app/data/dataStore.ts` - `getItems()`

**Fields** (inferred from TypeScript interface):

```typescript
interface Item {
  item_id: number;      // Primary key
  item_name: string;    // Product name
  item_price: number;   // Price of the item
}
```

**Fields Details**:
- `item_id` (number): Primary key, auto-increment
- `item_name` (string): Name of the product/item
- `item_price` (number): Price of the item

**Queries**:
- `SELECT * FROM item_table` (all items)

---

## Table: `grocery_history`

**Purpose**: Stores saved grocery plans and shopping history

**Location in Code**: `app/data/dataStore.ts` - `saveGroceryPlan()`, `getGroceryHistory()`, `getGroceryPlanById()`

**Fields** (inferred from TypeScript interface):

```typescript
interface GroceryPlan {
  id: string;           // Primary key (UUID)
  user_id: string;      // Foreign key to auth.users.id
  prompt: string;       // User's original prompt/request
  groceries: any[];     // JSON array of grocery items
  budget: number;       // Budget for this plan
  goals?: any[];        // Optional array of goals
  created_at: string;   // Timestamp (auto-generated)
}
```

**Fields Details**:
- `id` (string/UUID): Primary key, auto-generated
- `user_id` (string): Foreign key to `auth.users.id`
- `prompt` (string): The user's original request/prompt that generated this plan
- `groceries` (JSONB array): Array of grocery items, each containing:
  - `name` (string): Item name
  - `size` (string): Size/quantity
  - `img` (string): Image URL
  - `price` (number): Price
  - `nutriments` (object, optional): Nutritional data
- `budget` (number): Budget allocated for this plan
- `goals` (JSONB array, optional): Array of goal objects containing:
  - `id` (string): Goal identifier
  - `description` (string): Goal description
  - `type` (string): Goal type (e.g., "nutrition")
  - `target` (number): Target value
  - `current` (number): Current progress
  - `completed` (boolean): Whether goal is completed
  - `trophy` (string): Trophy emoji/icon
- `created_at` (timestamp): Auto-generated timestamp

**Queries**:
- `INSERT INTO grocery_history (user_id, prompt, groceries, budget, goals) VALUES (...) RETURNING *`
- `SELECT * FROM grocery_history WHERE user_id = $1 ORDER BY created_at DESC`
- `SELECT * FROM grocery_history WHERE id = $1` (single row)

---

## Table: `auth.users`

**Purpose**: Standard Supabase Auth managed table

**Location in Code**: Used throughout via `supabase.auth.getUser()`, `supabase.auth.getSession()`

**Fields** (Supabase standard):
- `id` (UUID): Primary key
- `email` (string): User email
- `created_at` (timestamp): Account creation timestamp
- `user_metadata` (JSONB): Additional user metadata
  - `full_name` (string, optional)
  - `name` (string, optional)

**Note**: This table is managed by Supabase Auth and has many more fields. Only the fields referenced in the code are listed here.

---

## Relationships

1. **user_data.user_id** → **auth.users.id** (One-to-One)
   - Each user has one profile record in `user_data`

2. **grocery_history.user_id** → **auth.users.id** (One-to-Many)
   - Each user can have multiple grocery plans in `grocery_history`

---

## Additional Notes

### Supabase Authentication
- The app uses Supabase Auth for user authentication
- User sessions are managed through `supabase.auth`
- JWT tokens are used for API authentication (see `app/api/generate-plan/route.ts` and `app/api/add-to-nofrills-cart/route.ts`)

### Data Types
- JSONB is likely used for array/complex object fields (`user_lists`, `groceries`, `goals`)
- Timestamps are auto-generated by Supabase
- UUIDs are used for primary keys in `grocery_history`

### Indexes (Recommended)
Based on query patterns, you should have indexes on:
- `user_data.user_id` (primary key)
- `grocery_history.user_id` (for filtering by user)
- `grocery_history.created_at` (for ordering)
- `item_table.item_id` (primary key)

### Row Level Security (RLS)
The codebase suggests RLS policies should be in place:
- Users should only access their own `user_data` records
- Users should only access their own `grocery_history` records

---

## SQL Schema Recreation Script

Based on the inferred schema, here's a potential SQL script to recreate the tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: user_data
CREATE TABLE IF NOT EXISTS user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_points INTEGER DEFAULT 0,
  user_lists JSONB DEFAULT '[]'::jsonb,
  user_goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: item_table
CREATE TABLE IF NOT EXISTS item_table (
  item_id SERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  item_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: grocery_history
CREATE TABLE IF NOT EXISTS grocery_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  groceries JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget NUMERIC(10, 2) NOT NULL,
  goals JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_grocery_history_user_id ON grocery_history(user_id);
CREATE INDEX IF NOT EXISTS idx_grocery_history_created_at ON grocery_history(created_at DESC);

-- Row Level Security Policies (example)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own user_data
CREATE POLICY "Users can read own user_data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert/update their own user_data
CREATE POLICY "Users can modify own user_data"
  ON user_data FOR ALL
  USING (auth.uid() = user_id);

-- Policy: Users can only read their own grocery_history
CREATE POLICY "Users can read own grocery_history"
  ON grocery_history FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own grocery_history
CREATE POLICY "Users can insert own grocery_history"
  ON grocery_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## File References

- **Data Store Functions**: `app/data/dataStore.ts`
- **Supabase Client**: `app/supabaseClient.ts`
- **Usage Examples**: 
  - `app/dashboard/page.tsx` - Fetches grocery history
  - `app/plan/page.tsx` - Saves grocery plans
  - `app/pod-details/page.tsx` - Fetches individual plans

---

## Connecting to a New Database

To connect your application to a new Supabase database, you need to set environment variables.

### Step 1: Create Environment File

Create a `.env.local` file in your project root (if it doesn't exist):

```bash
# In your project root directory
touch .env.local
```

### Step 2: Add Supabase Credentials

Add your Supabase credentials to `.env.local`:

```env
# Supabase Client (for Supabase JS SDK)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Drizzle ORM Database Connection (for direct PostgreSQL access)
# Get this from Supabase Dashboard → Settings → Database → Connection string (Session mode)
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres

# Groq AI API Key
GROQ_API_KEY=your-groq-key-here
```

### Step 3: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Navigate to **Settings** → **Database**
5. Copy the **Connection string** (Session mode) → Use for `DATABASE_URL`
   - Format: `postgresql://postgres:[password]@[host]:[port]/postgres`

### Step 4: Connection Points

Your application connects to Supabase in these locations:

1. **Client-side (main connection)**: `app/supabaseClient.ts`
   - Used by most pages and components
   - Uses: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Server-side (API routes)**:
   - `app/api/generate-plan/route.ts` - Creates its own Supabase client
   - `app/api/add-to-nofrills-cart/route.ts` - Creates its own Supabase client
   - Both use the same environment variables

### Step 5: Run Database Schema

Once connected, run the SQL schema script (found in this document under "SQL Schema Recreation Script") in your Supabase SQL Editor:

1. Go to Supabase dashboard → **SQL Editor**
2. Create a new query
3. Paste the SQL schema script
4. Run it to create all tables

### Step 6: Verify Connection

After setting up:
1. Restart your Next.js development server (`pnpm dev`)
2. Try logging in or creating a user account
3. Check that data is saving to your new database

### Important Notes

- **`.env.local`** is gitignored and won't be committed to version control
- Never commit your `.env.local` file with real credentials
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- Both client and server-side code can access these environment variables

---

*Generated from codebase analysis - Last updated: Based on current codebase state*

