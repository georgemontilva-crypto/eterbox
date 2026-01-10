#!/usr/bin/env node
/**
 * Script to update plans in production database
 * Run with: node update-plans-production.mjs
 */

import mysql from 'mysql2/promise';

const PRODUCTION_DB_URL = process.env.DATABASE_URL;

if (!PRODUCTION_DB_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

async function updatePlans() {
  let connection;
  
  try {
    console.log('🔄 Connecting to production database...');
    connection = await mysql.createConnection(PRODUCTION_DB_URL);
    console.log('✅ Connected to database');

    // Update Free plan
    console.log('\n📝 Updating Free plan...');
    await connection.execute(
      'UPDATE plans SET maxKeys = ?, maxFolders = ? WHERE name = ?',
      [10, 2, 'Free']
    );
    console.log('✅ Free plan updated: 10 credentials, 2 folders');

    // Update Basic plan
    console.log('\n📝 Updating Basic plan...');
    await connection.execute(
      'UPDATE plans SET price = ?, maxKeys = ?, maxFolders = ? WHERE name = ?',
      [15.00, 100, 20, 'Basic']
    );
    console.log('✅ Basic plan updated: $15, 100 credentials, 20 folders');

    // Update Corporate plan
    console.log('\n📝 Updating Corporate plan...');
    await connection.execute(
      'UPDATE plans SET price = ?, maxKeys = ?, maxFolders = ? WHERE name = ?',
      [25.00, 500, 200, 'Corporate']
    );
    console.log('✅ Corporate plan updated: $25, 500 credentials, 200 folders');

    // Verify changes
    console.log('\n🔍 Verifying changes...');
    const [rows] = await connection.execute(
      'SELECT id, name, price, maxKeys, maxFolders FROM plans ORDER BY price'
    );
    
    console.log('\n📊 Current plans in database:');
    console.table(rows);

    console.log('\n✅ All plans updated successfully!');
  } catch (error) {
    console.error('\n❌ Error updating plans:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

updatePlans();
