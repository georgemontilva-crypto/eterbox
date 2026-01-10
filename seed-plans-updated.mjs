import mysql from 'mysql2/promise';

// Parse DATABASE_URL properly
// Format: mysql://user:password@host:port/database
const dbUrl = process.env.DATABASE_URL;
let config;

if (dbUrl) {
  const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (match) {
    config = {
      host: match[3],
      port: parseInt(match[4]),
      user: match[1],
      password: match[2],
      database: match[5],
    };
  }
}

if (!config) {
  console.error('❌ Invalid DATABASE_URL format');
  process.exit(1);
}

console.log('🔗 Connecting to database:', config.host);

const connection = await mysql.createConnection(config);

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    maxKeys: 3,
    maxFolders: 1,
    maxGeneratedKeys: 10,
    price: '0',
    yearlyPrice: '0',
    yearlyDiscount: 0,
    stripePriceId: 'price_free',
    features: JSON.stringify(['3 Credentials', '1 Folder', '10 Generated Keys', 'AES-256 Encryption']),
    isActive: true,
  },
  {
    name: 'Basic',
    description: 'For individuals and small teams',
    maxKeys: 25,
    maxFolders: 5,
    maxGeneratedKeys: 300,
    price: '15',
    yearlyPrice: '160',
    yearlyDiscount: 11,
    stripePriceId: 'price_basic_monthly',
    features: JSON.stringify(['25 Credentials', '5 Folders', '300 Generated Keys', 'AES-256 Encryption', '2FA Support']),
    isActive: true,
  },
  {
    name: 'Corporate',
    description: 'For enterprises and large teams',
    maxKeys: 2500,
    maxFolders: 1500,
    maxGeneratedKeys: -1, // Unlimited
    price: '25',
    yearlyPrice: '280',
    yearlyDiscount: 7,
    stripePriceId: 'price_corporate_monthly',
    features: JSON.stringify(['2500 Credentials', '1500 Folders', 'Unlimited Generated Keys', 'AES-256 Encryption', '2FA Support', 'Priority Support']),
    isActive: true,
  },
];

try {
  // Check if plans already exist
  const [existingPlans] = await connection.execute('SELECT COUNT(*) as count FROM plans');
  
  if (existingPlans[0].count > 0) {
    console.log('⚠️  Plans already exist. Updating...');
    
    for (const plan of plans) {
      await connection.execute(
        `UPDATE plans SET 
          description = ?, 
          maxKeys = ?, 
          maxFolders = ?, 
          maxGeneratedKeys = ?,
          price = ?, 
          yearlyPrice = ?,
          yearlyDiscount = ?,
          stripePriceId = ?, 
          features = ?, 
          isActive = ?
        WHERE name = ?`,
        [
          plan.description,
          plan.maxKeys,
          plan.maxFolders,
          plan.maxGeneratedKeys,
          plan.price,
          plan.yearlyPrice,
          plan.yearlyDiscount,
          plan.stripePriceId,
          plan.features,
          plan.isActive,
          plan.name
        ]
      );
      console.log(`✓ Updated plan: ${plan.name}`);
    }
  } else {
    console.log('📝 Creating new plans...');
    
    for (const plan of plans) {
      await connection.execute(
        `INSERT INTO plans 
          (name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, stripePriceId, features, isActive) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plan.name,
          plan.description,
          plan.maxKeys,
          plan.maxFolders,
          plan.maxGeneratedKeys,
          plan.price,
          plan.yearlyPrice,
          plan.yearlyDiscount,
          plan.stripePriceId,
          plan.features,
          plan.isActive
        ]
      );
      console.log(`✓ Created plan: ${plan.name}`);
    }
  }
  
  console.log('✅ All plans seeded successfully!');
  
  // Show final plans
  const [finalPlans] = await connection.execute('SELECT id, name, price, yearlyPrice, maxKeys, maxFolders, maxGeneratedKeys FROM plans');
  console.log('\n📊 Current plans in database:');
  console.table(finalPlans);
  
} catch (error) {
  console.error('❌ Error seeding plans:', error.message);
  console.error(error);
} finally {
  await connection.end();
}
