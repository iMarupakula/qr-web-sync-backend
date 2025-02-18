require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: { encrypt: false, trustServerCertificate: true }
};

async function testConnection() {
    try {
        let pool = await sql.connect(dbConfig);
        console.log("✅ Connected to SQL Server successfully!");
        let result = await pool.request().query("SELECT TOP 1 * FROM Sessions");
        console.log("Sample Data:", result.recordset);
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
}

testConnection();
