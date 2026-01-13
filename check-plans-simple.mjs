import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [plans] = await connection.execute("SELECT * FROM plans");
console.log(JSON.stringify(plans, null, 2));

await connection.end();
