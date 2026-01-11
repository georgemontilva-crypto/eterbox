import mysql from 'mysql2/promise';

// Obtener credenciales de variables de entorno
const config = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'railway'
};

async function migratePlans() {
  let connection;
  
  try {
    console.log('🔌 Conectando a base de datos...');
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Database: ${config.database}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado exitosamente!\n');

    // Verificar si ya existe el plan Enterprise
    const [existingPlans] = await connection.execute('SELECT id, name FROM plans ORDER BY id');
    console.log('📋 Planes actuales:');
    existingPlans.forEach(plan => {
      console.log(`   ${plan.id}. ${plan.name}`);
    });

    const hasEnterprise = existingPlans.some(p => p.id === 4);
    
    if (hasEnterprise) {
      console.log('\n⚠️  Plan Enterprise ya existe. Saltando migración.');
      console.log('   Si necesitas actualizar, elimina el plan manualmente primero.');
      return;
    }

    console.log('\n🔄 Iniciando migración...\n');

    // 1. Actualizar Plan Corporate
    console.log('1️⃣  Actualizando Plan Corporate...');
    await connection.execute(`
      UPDATE plans 
      SET features = JSON_ARRAY(
        '1000 credentials',
        '100 folders',
        'Military-grade encryption',
        'Unlimited password generation',
        '2FA support',
        'Complete audits and compliance',
        'Automatic backup',
        '24/7 dedicated support'
      ),
      updatedAt = NOW()
      WHERE id = 3
    `);
    console.log('   ✅ Plan Corporate actualizado\n');

    // 2. Crear Plan Enterprise
    console.log('2️⃣  Creando Plan Enterprise...');
    await connection.execute(`
      INSERT INTO plans (
        id, name, description, maxKeys, maxFolders, maxGeneratedKeys, 
        price, yearlyPrice, yearlyDiscount, features, isActive, createdAt, updatedAt
      )
      VALUES (
        4, 
        'Enterprise', 
        'For corporations and clients with critical security needs', 
        -1, 
        -1, 
        -1, 
        99.00, 
        1080.00, 
        9,
        JSON_ARRAY(
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
        ),
        1,
        NOW(),
        NOW()
      )
    `);
    console.log('   ✅ Plan Enterprise creado\n');

    // Verificar resultado
    const [updatedPlans] = await connection.execute(
      'SELECT id, name, maxKeys, maxFolders, price FROM plans ORDER BY id'
    );
    
    console.log('📊 Planes después de la migración:');
    console.table(updatedPlans);

    console.log('\n🎉 ¡Migración completada exitosamente!');

  } catch (error) {
    console.error('\n❌ Error en migración:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    // No hacer throw para que Railway no falle el deploy
    console.error('\n⚠️  La migración falló pero el deploy continuará.');
    console.error('   Puedes ejecutar la migración manualmente más tarde.');
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar migración solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 MIGRACIÓN DE PLANES - ETERBOX');
  console.log('=' .repeat(60));
  console.log('Fecha:', new Date().toLocaleString('es-ES'));
  console.log('=' .repeat(60));
  console.log('\n');
  
  migratePlans()
    .then(() => {
      console.log('\n✅ Script de migración finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error fatal:', error);
      process.exit(1);
    });
}

export default migratePlans;
