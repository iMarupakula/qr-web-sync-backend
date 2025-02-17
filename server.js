// Backend (Node.js + Express)
const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let sessions = {}; // Store session data

// Generate a QR Code with a unique session ID
app.get('/generate', async (req, res) => {
    const sessionId = uuidv4();
    sessions[sessionId] = { data: "Sample data" }; // Store initial session data
    const url = `http://localhost:3000/session/${sessionId}`;
    const qrCode = await qrcode.toDataURL(url);
    res.json({ sessionId, qrCode });
});

// Fetch session data
app.get('/session/:id', (req, res) => {
    const sessionData = sessions[req.params.id];
    if (sessionData) {
        res.json(sessionData);
    } else {
        res.status(404).json({ error: 'Session not found' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));

// Frontend (React)
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [qrCode, setQrCode] = useState(null);

    const generateQRCode = async () => {
        const response = await axios.get('http://localhost:5000/generate');
        setQrCode(response.data.qrCode);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800">Scan QR Code to Access on Mobile</h1>
                <p className="text-gray-600 mt-2">Click the button below to generate a QR Code.</p>
                <button onClick={generateQRCode} className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition">
                    Generate QR
                </button>
                {qrCode && <img src={qrCode} alt="QR Code" className="mt-4 w-48 h-48 border border-gray-300 shadow-md" />}
            </div>
        </div>
    );
};

export default App;
