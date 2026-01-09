import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'eterbox',
});

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    maxKeys: 3,
    maxFolders: 1,
    price: '0',
    stripePriceId: 'price_free',
    features: JSON.stringify(['3 Credentials', '1 Folder', 'AES-256 Encryption']),
    isActive: true,
  },
  {
    name: 'Basic',
    description: 'For individuals and small teams',
    maxKeys: 25,
    maxFolders: 5,
    price: '15',
    stripePriceId: 'price_basic',
    features: JSON.stringify(['25 Credentials', '5 Folders', 'AES-256 Encryption', '2FA Support']),
    isActive: true,
  },
  {
    name: 'Corporate',
    description: 'For enterprises and large teams',
    maxKeys: 999999,
    maxFolders: 999999,
    price: '25',
    stripePriceId: 'price_corporate',
    features: JSON.stringify(['Unlimited Credentials', 'Unlimited Folders', 'AES-256 Encryption', '2FA Support', 'Priority Support']),
    isActive: true,
  },
];

try {
  for (const plan of plans) {
    await connection.execute(
      'INSERT INTO plans (name, description, maxKeys, maxFolders, price, stripePriceId, features, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [plan.name, plan.description, plan.maxKeys, plan.maxFolders, plan.price, plan.stripePriceId, plan.features, plan.isActive]
    );
    console.log(`✓ Created plan: ${plan.name}`);
  }
  console.log('✓ All plans seeded successfully!');
} catch (error) {
  console.error('Error seeding plans:', error.message);
} finally {
  await connection.end();
}
