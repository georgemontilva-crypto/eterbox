#!/usr/bin/env node
/**
 * Update Corporate plan to unlimited (-1) in production database
 * 
 * Usage:
 * 1. In Railway, change "Custom Start Command" to: node scripts/update-corporate-unlimited.mjs
 * 2. Wait for deployment and check logs
 * 3. Restore "Custom Start Command" to: npm run start
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema.js';

async function updateCorporatePlan() {
  console.log('🚀 Starting Corporate plan update...');
  
  try {
    // Create database connection
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection, { schema, mode: 'default' });
    
    console.log('✅ Database connected');
    
    // Update Corporate plan to unlimited
    const result = await db
      .update(schema.plans)
      .set({
        maxKeys: -1,
        maxFolders: -1,
      })
      .where(eq(schema.plans.name, 'Corporate'));
    
    console.log('✅ Corporate plan updated successfully!');
    console.log(`   - maxKeys: -1 (Unlimited)`);
    console.log(`   - maxFolders: -1 (Unlimited)`);
    
    // Verify the update
    const corporatePlan = await db.query.plans.findFirst({
      where: eq(schema.plans.name, 'Corporate'),
    });
    
    console.log('\n📊 Verification:');
    console.log(`   - Plan: ${corporatePlan.name}`);
    console.log(`   - Max Keys: ${corporatePlan.maxKeys} ${corporatePlan.maxKeys === -1 ? '(∞ Unlimited)' : ''}`);
    console.log(`   - Max Folders: ${corporatePlan.maxFolders} ${corporatePlan.maxFolders === -1 ? '(∞ Unlimited)' : ''}`);
    
    await connection.end();
    console.log('\n✅ DONE! Corporate plan is now unlimited.');
    console.log('⚠️  Remember to restore the start command to: npm run start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating Corporate plan:', error);
    process.exit(1);
  }
}

updateCorporatePlan();
