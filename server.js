const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let sessions = {};

app.get('/generate', async (req, res) => {
    const sessionId = uuidv4();
    sessions[sessionId] = { data: "Sample data" };
    const url = `https://your-frontend-url.netlify.app/session/${sessionId}`;
    const qrCode = await qrcode.toDataURL(url);
    res.json({ sessionId, qrCode });
});

app.get('/session/:id', (req, res) => {
    const sessionData = sessions[req.params.id];
    if (sessionData) {
        res.json(sessionData);
    } else {
        res.status(404).json({ error: 'Session not found' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
