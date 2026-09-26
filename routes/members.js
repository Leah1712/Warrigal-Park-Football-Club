
const express = require('express');

const router = express.Router();

const db = require('../db');


// Create a new member
router.post('/', (req, res) => {

    // Get the information sent from the form
    const {
        name,
        date_of_birth
    } = req.body;


    // Check that required information was entered
    if (!name || !date_of_birth) {

        return res.status(400).json({
            message: 'Name and date of birth are required.'
        });

    }


    // SQL query to insert the new member
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
            res.status(201).json({

                message: 'Member created successfully.',

                member_id: result.insertId

            });

        }
    );

});


module.exports = router;