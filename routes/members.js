const express = require('express');

const router = express.Router();

const db = require('../db');

// NOTE (Scenario 3 - Data storage):
// This route relies entirely on `../db` for persistence. As long as db.js
// connects to a real database (e.g. MySQL/Postgres/SQLite file), every
// record inserted here survives an application restart automatically -
// there is no in-memory array to lose. No extra code is needed for this
// scenario as long as that connection is to a persistent database.


// Create a new member
router.post('/', (req, res) => {

    // Get the information sent from the form
    const {
        name,
        date_of_birth,
        confirm // true when the registrar has confirmed they want to save a duplicate anyway
    } = req.body;


    // Check that required information was entered
    if (!name || !date_of_birth) {

        return res.status(400).json({
            message: 'Name and date of birth are required.'
        });

    }


    // Scenario 2: Duplicate member handling
    // Check whether a member with the same name and date of birth already exists
    const duplicateCheckSql = `
        SELECT id FROM members
        WHERE name = ? AND date_of_birth = ?
    `;

    db.query(duplicateCheckSql, [name, date_of_birth], (err, existingRows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: 'Failed to check for duplicate members.'
            });

        }

        // If a duplicate exists and the registrar has not yet confirmed, flag it
        if (existingRows.length > 0 && !confirm) {

            return res.status(409).json({
                duplicate: true,
                message: 'A member with the same name and date of birth already exists. Do you want to add this record anyway?'
            });

        }

        // SQL query to insert the new member
        const insertSql = `
            INSERT INTO members
            (name, date_of_birth, status)
            VALUES (?, ?, 'Active')
        `;

        // Run the SQL query
        db.query(
            insertSql,
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
                res.status(201).json({

                    message: 'Member created successfully.',

                    member_id: result.insertId

                });

            }
        );

    });

});


// Scenario 4: Update or deactivate member
// Edits details and/or status (e.g. 'Active' / 'Inactive') without deleting the record
router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        name,
        date_of_birth,
        status
    } = req.body;

    // Build the update dynamically so a partial update (e.g. status only) still works
    const fields = [];
    const values = [];

    if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
    }

    if (date_of_birth !== undefined) {
        fields.push('date_of_birth = ?');
        values.push(date_of_birth);
    }

    if (status !== undefined) {
        fields.push('status = ?');
        values.push(status);
    }

    if (fields.length === 0) {

        return res.status(400).json({
            message: 'No fields provided to update.'
        });

    }

    values.push(id);

    const updateSql = `
        UPDATE members
        SET ${fields.join(', ')}
        WHERE id = ?
    `;

    db.query(updateSql, values, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: 'Failed to update member.'
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'Member not found.'
            });

        }

        res.status(200).json({
            message: 'Member updated successfully.'
        });

    });

});


module.exports = router;