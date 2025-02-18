require('dotenv').config();
const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// MS SQL Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: { encrypt: false, trustServerCertificate: true }
};

// Generate a QR Code and Save to Database
app.get('/generate', async (req, res) => {
    try {
        const sessionId = uuidv4();
        const url = `https://qr-web-sync-frontend.netlify.app/${sessionId}`;
        const qrCode = await qrcode.toDataURL(url);

        // Connect to DB
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.UniqueIdentifier, sessionId)
            .input('qr_code', sql.NVarChar, qrCode)
            .query("INSERT INTO Sessions (id, qr_code) VALUES (@id, @qr_code)");

        res.json({ sessionId, qrCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Retrieve QR Code from Database
app.get('/session/:id', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.UniqueIdentifier, req.params.id)
            .query("SELECT qr_code FROM Sessions WHERE id = @id");

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: "Session not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
