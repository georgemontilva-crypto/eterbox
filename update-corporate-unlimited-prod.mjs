import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { plans } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const { Pool } = pg;

// Get DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔗 Connecting to production database...');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = drizzle(pool);

async function updateCorporatePlan() {
  try {
    console.log('🔍 Finding Corporate plan...');
    
    // Update Corporate plan to have unlimited credentials and folders
    const result = await db
      .update(plans)
      .set({
        maxKeys: -1,
        maxFolders: -1
      })
      .where(eq(plans.name, 'Corporate'))
      .returning();

    if (result.length > 0) {
      console.log('✅ Corporate plan updated successfully!');
      console.log('📊 Updated plan:', result[0]);
      console.log('   - maxKeys: 999999 → -1 (Unlimited)');
      console.log('   - maxFolders: 999999 → -1 (Unlimited)');
    } else {
      console.log('⚠️  No Corporate plan found in database');
    }

    await pool.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error updating Corporate plan:', error);
    await pool.end();
    process.exit(1);
  }
}

updateCorporatePlan();
