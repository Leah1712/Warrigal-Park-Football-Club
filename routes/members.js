const express = require('express');
const router = express.Router();
const db = require('../db');

// Scenario 2: Check for existing duplicate before creating

router.post('/', (req, res) => {
    const { name, date_of_birth, confirmDuplicate } = req.body;

    if (!name || !date_of_birth) {
        return res.status(400).json({ message: 'Name and Date of Birth are required.' });
    }

    // Step 1: Check if a record with the same name and DOB already exists
    const checkSql = 'SELECT * FROM members WHERE name = ? AND date_of_birth = ?';
    db.query(checkSql, [name, date_of_birth], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        // Step 2: Flag duplicate if found and registrar hasn't confirmed yet
        if (results.length > 0 && !confirmDuplicate) {
            return res.status(409).json({
                isDuplicate: true,
                message: 'A member with the same name and date of birth already exists.'
            });
        }

        // Step 3: Proceed with creation if no duplicate or if confirmed
        const insertSql = 'INSERT INTO members (name, date_of_birth) VALUES (?, ?)';
        db.query(insertSql, [name, date_of_birth], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error while saving.' });
            return res.status(201).json({
                message: 'Member created successfully.',
                memberId: result.insertId
            });
        });
    });
});

module.exports = router;

