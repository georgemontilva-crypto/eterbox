import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

try {
  console.log('Testing database connection...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✅ Connection successful');
  const [rows] = await conn.execute('SELECT COUNT(*) as count FROM users');
  console.log('✅ Query successful, users count:', rows[0].count);
  await conn.end();
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  console.error('Error code:', error.code);
}
