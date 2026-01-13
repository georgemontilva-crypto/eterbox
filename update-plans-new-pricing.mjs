import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (!dbUrl) {
  console.error('❌ Error: DATABASE_URL no está configurada');
  process.exit(1);
}

async function updatePlans() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbUrl);
    console.log('✅ Conectado exitosamente\n');

    // Plan 1: Free
    const freePlan = {
      name: 'Free',
      description: 'Perfect for getting started',
      maxKeys: 25,
      maxFolders: 3,
      maxGeneratedKeys: 20,
      price: '0.00',
      yearlyPrice: '0.00',
      yearlyDiscount: 0,
      features: JSON.stringify([
        '25 credentials',
        '3 folders',
        '20 generated passwords per month',
        'AES-256 Encryption',
        'Two-Factor Authentication',
        '1 device only'
      ])
    };

    // Plan 2: Basic
    const basicPlan = {
      name: 'Basic',
      description: 'For freelancers and professionals',
      maxKeys: -1, // Ilimitado
      maxFolders: -1, // Ilimitado
      maxGeneratedKeys: -1, // Ilimitado
      price: '3.99',
      yearlyPrice: '39.99',
      yearlyDiscount: 17,
      features: JSON.stringify([
        'Unlimited credentials',
        'Unlimited folders',
        'Unlimited generated passwords',
        'AES-256 Encryption',
        'Two-Factor Authentication',
        'Unlimited devices',
        'Export/Import Credentials',
        'Automatic backup',
        'Biometric authentication',
        'Change history',
        'Security alerts',
        'Priority support (24h)'
      ])
    };

    // Plan 3: Corporate
    const corporatePlan = {
      name: 'Corporate',
      description: 'For teams and small businesses',
      maxKeys: -1, // Ilimitado
      maxFolders: -1, // Ilimitado
      maxGeneratedKeys: -1, // Ilimitado
      price: '19.99',
      yearlyPrice: '199.99',
      yearlyDiscount: 17,
      features: JSON.stringify([
        'Up to 5 users',
        'Everything in Basic',
        'Share credentials/folders',
        'Team admin panel',
        'Complete audits and compliance',
        '24/7 dedicated support'
      ])
    };

    // Plan 4: Enterprise
    const enterprisePlan = {
      name: 'Enterprise',
      description: 'For corporations and clients with critical security needs',
      maxKeys: -1, // Ilimitado
      maxFolders: -1, // Ilimitado
      maxGeneratedKeys: -1, // Ilimitado
      price: '49.99',
      yearlyPrice: '499.99',
      yearlyDiscount: 17,
      features: JSON.stringify([
        'Up to 10 users included',
        '$4.99 per additional user',
        'Everything in Corporate',
        'SSO Integration',
        'Advanced multi-user (up to unlimited)',
        'Complete audits and compliance',
        '24/7 dedicated support',
        'Dedicated onboarding'
      ])
    };

    console.log('📝 Actualizando planes...\n');

    // Actualizar cada plan
    const plans = [
      { id: 1, ...freePlan },
      { id: 2, ...basicPlan },
      { id: 3, ...corporatePlan },
      { id: 4, ...enterprisePlan }
    ];

    for (const plan of plans) {
      const { id, ...planData } = plan;
      
      const [result] = await connection.execute(
        `UPDATE plans 
         SET name = ?, 
             description = ?, 
             maxKeys = ?, 
             maxFolders = ?, 
             maxGeneratedKeys = ?, 
             price = ?, 
             yearlyPrice = ?, 
             yearlyDiscount = ?,
             features = ?,
             updatedAt = NOW()
         WHERE id = ?`,
        [
          planData.name,
          planData.description,
          planData.maxKeys,
          planData.maxFolders,
          planData.maxGeneratedKeys,
          planData.price,
          planData.yearlyPrice,
          planData.yearlyDiscount,
          planData.features,
          id
        ]
      );

      if (result.affectedRows > 0) {
        console.log(`✅ Plan ${planData.name} actualizado`);
      } else {
        console.log(`⚠️  Plan ${planData.name} no encontrado, insertando...`);
        
        await connection.execute(
          `INSERT INTO plans (id, name, description, maxKeys, maxFolders, maxGeneratedKeys, price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
          [
            id,
            planData.name,
            planData.description,
            planData.maxKeys,
            planData.maxFolders,
            planData.maxGeneratedKeys,
            planData.price,
            planData.yearlyPrice,
            planData.yearlyDiscount,
            planData.features
          ]
        );
        
        console.log(`✅ Plan ${planData.name} insertado`);
      }
    }

    // Mostrar los planes actualizados
    console.log('\n📊 Planes actualizados:\n');
    const [rows] = await connection.execute(
      'SELECT id, name, price, yearlyPrice, maxKeys, maxFolders, maxGeneratedKeys FROM plans ORDER BY id'
    );

    console.table(rows);

    console.log('\n✅ Actualización completada exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updatePlans();
