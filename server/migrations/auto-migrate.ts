import * as mysql from "mysql2/promise";

/**
 * Auto-migration script to add dynamic QR fields
 * This runs automatically on server startup
 */
export async function runAutoMigrations() {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  
  if (!dbUrl) {
    console.log("[Migration] No database URL found, skipping migrations");
    return;
  }

  let connection;
  
  try {
    connection = await mysql.createConnection(dbUrl);
    console.log("[Migration] Connected to database");

    // Check if shortCode column exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM qr_codes LIKE 'shortCode'"
    );

    if (Array.isArray(columns) && columns.length === 0) {
      console.log("[Migration] Adding shortCode and isDynamic columns...");
      
      // Add shortCode column
      await connection.query(`
        ALTER TABLE qr_codes 
        ADD COLUMN shortCode VARCHAR(20) UNIQUE
      `);
      
      // Add isDynamic column
      await connection.query(`
        ALTER TABLE qr_codes 
        ADD COLUMN isDynamic BOOLEAN DEFAULT FALSE
      `);
      
      // Add index for shortCode
      await connection.query(`
        CREATE INDEX idx_shortCode ON qr_codes(shortCode)
      `);
      
      console.log("[Migration] ✅ Dynamic QR fields added successfully");
    } else {
      console.log("[Migration] Dynamic QR fields already exist, skipping");
    }

    // Check if qr_folder_shares table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'qr_folder_shares'"
    );

    if (Array.isArray(tables) && tables.length === 0) {
      console.log("[Migration] Creating qr_folder_shares table...");
      
      await connection.query(`
        CREATE TABLE qr_folder_shares (
          id INT AUTO_INCREMENT PRIMARY KEY,
          folder_id INT NOT NULL,
          owner_id INT NOT NULL,
          shared_with_user_id INT NOT NULL,
          permission ENUM('read', 'edit') DEFAULT 'edit',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (folder_id) REFERENCES qr_folders(id) ON DELETE CASCADE,
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_share (folder_id, shared_with_user_id)
        )
      `);
      
      console.log("[Migration] ✅ qr_folder_shares table created successfully");
    } else {
      console.log("[Migration] qr_folder_shares table already exists, skipping");
    }

  } catch (error: any) {
    // Ignore duplicate column errors
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("[Migration] Columns already exist, skipping");
    } else {
      console.error("[Migration] Error running migrations:", error.message);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
