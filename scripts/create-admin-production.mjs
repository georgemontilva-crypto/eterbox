/**
 * Script to create admin user in PRODUCTION database
 * Run this in Railway using: node scripts/create-admin-production.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { users } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

async function createAdminUser() {
  console.log("🚀 Creating admin user in PRODUCTION database...\n");

  // Get database URL from environment (Railway will provide this)
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    process.env.MYSQL_PUBLIC_URL ||
    `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

  if (!dbUrl || dbUrl.includes("undefined")) {
    console.error("❌ Error: Database configuration not found");
    console.log("\nAvailable environment variables:");
    console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✓" : "✗");
    console.log("- MYSQL_URL:", process.env.MYSQL_URL ? "✓" : "✗");
    console.log("- MYSQL_PUBLIC_URL:", process.env.MYSQL_PUBLIC_URL ? "✓" : "✗");
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection(dbUrl);
    console.log("✅ Connected to database\n");

    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id, email, role FROM users WHERE email = ?",
      ["admin@eterbox.com"]
    );

    if (existingUsers.length > 0) {
      console.log("⚠️  Admin user already exists!");
      console.log("   Updating password and verifying email...\n");

      // Update existing user
      const password = "Admin123!";
      const hashedPassword = await bcrypt.hash(password, 12);

      await connection.execute(
        "UPDATE users SET password = ?, emailVerified = 1, loginMethod = 'email', role = 'admin' WHERE email = ?",
        [hashedPassword, "admin@eterbox.com"]
      );

      console.log("✅ Admin user updated successfully!");
    } else {
      console.log("🔐 Creating new admin user...\n");

      // Create new admin user
      const password = "Admin123!";
      const hashedPassword = await bcrypt.hash(password, 12);

      await connection.execute(
        `INSERT INTO users (name, email, password, role, emailVerified, loginMethod, planId, twoFactorEnabled, webauthnEnabled) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Administrator",
          "admin@eterbox.com",
          hashedPassword,
          "admin",
          1, // true
          "email",
          1, // Free plan
          0, // false
          0, // false
        ]
      );

      console.log("✅ Admin user created successfully!");
    }

    // Verify the user
    const [verifyUsers] = await connection.execute(
      "SELECT id, name, email, role, emailVerified, loginMethod, LENGTH(password) as pwd_length FROM users WHERE email = ?",
      ["admin@eterbox.com"]
    );

    console.log("\n" + "=".repeat(60));
    console.log("✅ ADMIN USER READY");
    console.log("=".repeat(60));
    console.log("\nUser details:");
    console.log(JSON.stringify(verifyUsers[0], null, 2));
    console.log("\n" + "=".repeat(60));
    console.log("🔐 LOGIN CREDENTIALS");
    console.log("=".repeat(60));
    console.log("\n📧 Email: admin@eterbox.com");
    console.log("🔑 Password: Admin123!");
    console.log("\n🌐 Login at: https://eterbox.com/login");
    console.log("🎯 Admin panel: https://eterbox.com/admin");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("=".repeat(60) + "\n");

    await connection.end();
    console.log("✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createAdminUser();
