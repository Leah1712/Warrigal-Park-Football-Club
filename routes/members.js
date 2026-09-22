const express = require('express');
const router = express.Router();
const db = require('../db');

// Scenario 3: Fetch stored member records from the database
router.get('/', (req, res) => {
    const sql = 'SELECT id, name, DATE_FORMAT(date_of_birth, "%Y-%m-%d") AS date_of_birth FROM members ORDER BY id DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving members from database.' });
        }
        res.json(results);
    });
});

module.exports = router;


