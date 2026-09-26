const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file (created automatically if it doesn't exist)
const dbPath = path.join(__dirname, 'club.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the members table if it doesn't already exist
db.run(`
    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating members table:', err.message);
    }
});

module.exports = db;