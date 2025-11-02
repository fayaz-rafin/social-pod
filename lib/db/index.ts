import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Get database connection string from environment
// For Supabase, this should be in the format: postgresql://postgres:[password]@[host]:[port]/postgres
// You can find this in Supabase Dashboard → Settings → Database → Connection string (Session mode)
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client
// For Supabase connection pooling, disable prepare as it's not supported
const client = postgres(connectionString, { prepare: false });

// Create and export Drizzle instance
export const db = drizzle(client);

