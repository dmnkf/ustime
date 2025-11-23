import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

pool.on('connect', () => {
    console.log('✅ Database connected successfully');
});

export const db = drizzle(pool, { schema });
