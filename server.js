

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const pool = require('./db'); // 👈 import database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Sample HTML routes
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'eyeglasses.html'));
});

// --- Feedback Route ---
app.post('/api/feedback', (req, res) => {
    const { name, email, message } = req.body;
    const log = `Feedback from ${name} (${email}): ${message}\n`;
    fs.appendFile('feedback.txt', log, err => {
        if (err) {
            console.error('Error saving feedback:', err);
            return res.status(500).send('Server error');
        }
        console.log('New feedback:', log);
        res.status(200).send('Feedback received!');
    });
});

// --- Newsletter Route ---
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    const log = `Newsletter subscription: ${email}\n`;
    fs.appendFile('newsletter.txt', log, err => {
        if (err) {
            console.error('Error saving newsletter:', err);
            return res.status(500).send('Server error');
        }
        console.log('New newsletter signup:', email);
        res.status(200).send('Subscribed!');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
