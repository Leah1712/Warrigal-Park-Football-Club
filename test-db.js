const db = require('./db');

// Simple check: insert a test row, then read it back
db.run(
    'INSERT INTO members (name, date_of_birth) VALUES (?, ?)',
    ['Test Player', '2000-01-01'],
    function (err) {
        if (err) {
            console.error('Insert failed:', err.message);
            return;
        }

        console.log(`Inserted test member with id ${this.lastID}`);

        db.all('SELECT * FROM members', [], (err, rows) => {
            if (err) {
                console.error('Read failed:', err.message);
                return;
            }

            console.log('Current members table:');
            console.table(rows);

            db.close();
        });
    }
);