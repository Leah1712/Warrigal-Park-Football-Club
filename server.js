const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies
app.use(express.json());

// Serve the static frontend files (add-member.html, members.css, member.js)
app.use(express.static(path.join(__dirname, 'public')));

// Create a new member
app.post('/api/members', (req, res) => {
    const { name, date_of_birth } = req.body;

    if (!name || !date_of_birth) {
        return res.status(400).json({
            message: 'Name and date of birth are required.'
        });
    }

    const sql = 'INSERT INTO members (name, date_of_birth) VALUES (?, ?)';

    db.run(sql, [name, date_of_birth], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: 'Something went wrong saving the member.'
            });
        }

        res.status(201).json({
            id: this.lastID,
            name,
            date_of_birth
        });
    });
});

// Get all members
app.get('/api/members', (req, res) => {
    db.all('SELECT * FROM members', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: 'Unable to fetch members.'
            });
        }

        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});