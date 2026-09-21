const db = require('./db');

db.query('SELECT 1', (err, result) => {

    if (err) {
        console.error('Database test failed:', err);
        return;
    }

    console.log('Database test successful!');
    console.log(result);

    db.end();
});