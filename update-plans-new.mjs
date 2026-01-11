import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'eterbox',
};

async function updatePlans() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully\n');

    // Updated plans data
    const plans = [
      {
        id: 1,
        name: 'Free',
        description: 'Perfect for getting started',
        maxKeys: 10,
        maxFolders: 2,
        maxGeneratedKeys: 10,
        price: '0.00',
        yearlyPrice: '0.00',
        yearlyDiscount: 0,
        features: JSON.stringify([
          '10 credentials',
          '2 folders',
          'Basic encryption',
          'Password generator (10/month)'
        ]),
        isActive: true
      },
      {
        id: 2,
        name: 'Basic',
        description: 'For freelancers and professionals',
        maxKeys: 100,
        maxFolders: 10,
        maxGeneratedKeys: 300,
        price: '12.99',
        yearlyPrice: '140.00',
        yearlyDiscount: 11,
        features: JSON.stringify([
          '100 credentials',
          '10 folders',
          'Military-grade encryption',
          'Password generator (300/month)',
          '2FA support',
          'Priority email support'
        ]),
        isActive: true
      },
      {
        id: 3,
        name: 'Corporate',
        description: 'For teams and small businesses',
        maxKeys: 1000,
        maxFolders: 100,
        maxGeneratedKeys: -1, // unlimited
        price: '29.00',
        yearlyPrice: '300.00',
        yearlyDiscount: 7,
        features: JSON.stringify([
          '1000 credentials',
          '100 folders',
          'Military-grade encryption',
          'Unlimited password generation',
          '2FA support',
          'Complete audits and compliance',
          'Automatic backup',
          '24/7 dedicated support'
        ]),
        isActive: true
      },
      {
        id: 4,
        name: 'Enterprise',
        description: 'For corporations and clients with critical security needs',
        maxKeys: -1, // unlimited
        maxFolders: -1, // unlimited
        maxGeneratedKeys: -1, // unlimited
        price: '99.00',
        yearlyPrice: '1080.00',
        yearlyDiscount: 9,
        features: JSON.stringify([
          'Unlimited credentials',
          'Unlimited folders',
          'Military-grade encryption',
          'Unlimited password generation',
          '2FA support',
          'Advanced multi-user (up to 20 members)',
          'Complete audits and compliance',
          'Automatic backup',
          '24/7 dedicated support',
          'Custom integrations',
          'Dedicated account manager'
        ]),
        isActive: true
      }
    ];

    console.log('📝 Updating plans...\n');

    for (const plan of plans) {
      const [result] = await connection.execute(
        `INSERT INTO plans (id, name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           description = VALUES(description),
           maxKeys = VALUES(maxKeys),
           maxFolders = VALUES(maxFolders),
           maxGeneratedKeys = VALUES(maxGeneratedKeys),
           price = VALUES(price),
           yearlyPrice = VALUES(yearlyPrice),
           yearlyDiscount = VALUES(yearlyDiscount),
           features = VALUES(features),
           isActive = VALUES(isActive),
           updatedAt = NOW()`,
        [
          plan.id,
          plan.name,
          plan.description,
          plan.maxKeys,
          plan.maxFolders,
          plan.maxGeneratedKeys,
          plan.price,
          plan.yearlyPrice,
          plan.yearlyDiscount,
          plan.features,
          plan.isActive
        ]
      );

      console.log(`✅ ${plan.name} plan updated/created`);
      console.log(`   - Credentials: ${plan.maxKeys === -1 ? 'Unlimited' : plan.maxKeys}`);
      console.log(`   - Folders: ${plan.maxFolders === -1 ? 'Unlimited' : plan.maxFolders}`);
      console.log(`   - Price: $${plan.price}/month ($${plan.yearlyPrice}/year)`);
      console.log('');
    }

    // Display all plans
    console.log('\n📊 Current plans in database:\n');
    const [rows] = await connection.execute('SELECT * FROM plans ORDER BY id');
    
    console.table(rows.map(row => ({
      ID: row.id,
      Name: row.name,
      Credentials: row.maxKeys === -1 ? 'Unlimited' : row.maxKeys,
      Folders: row.maxFolders === -1 ? 'Unlimited' : row.maxFolders,
      'Price/Month': `$${row.price}`,
      'Price/Year': `$${row.yearlyPrice}`,
      'Discount %': row.yearlyDiscount
    })));

    console.log('\n✅ All plans updated successfully!');

  } catch (error) {
    console.error('❌ Error updating plans:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the update
updatePlans().catch(console.error);
