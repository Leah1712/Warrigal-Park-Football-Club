const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new member (Handles Scenario 1 & Scenario 2)
router.post('/', (req, res) => {

    // Get the information sent from the form
    const {
        name,
        date_of_birth,
        confirmDuplicate // Flag sent from frontend when user confirms duplicate creation
    } = req.body;

    // Check that required information was entered
    if (!name || !date_of_birth) {
        return res.status(400).json({
            message: 'Name and date of birth are required.'
        });
    }

    // --- SCENARIO 2: Check for existing duplicate record ---
    const checkDuplicateSql = `
        SELECT * FROM members 
        WHERE name = ? AND date_of_birth = ?
    `;

    db.query(checkDuplicateSql, [name, date_of_birth], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Failed to check for existing member.'
            });
        }

        // If duplicate is found AND user has not confirmed saving anyway
        if (results.length > 0 && !confirmDuplicate) {
            return res.status(409).json({
                isDuplicate: true,
                message: 'A member with the same name and date of birth already exists.'
            });
        }

        // --- SCENARIO 1: Insert new member record ---
        const sql = `
            INSERT INTO members
            (name, date_of_birth, status)
            VALUES (?, ?, 'Active')
        `;

        // Run the SQL query
        db.query(
            sql,
            [name, date_of_birth],
            (err, result) => {

                // If there is a database error
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: 'Failed to create member.'
                    });
                }

                // Send successful response
                return res.status(201).json({
                    message: 'Member created successfully.',
                    member_id: result.insertId
                });

            }
        );

    });

});

module.exports = router;