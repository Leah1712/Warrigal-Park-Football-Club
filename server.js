const express = require('express');

const app = express();


// Import member routes
const memberRoutes = require('./routes/members');


// Allow the server to receive JSON data
app.use(express.json());


// Serve the HTML, CSS and JavaScript files
app.use(express.static('public'));


// Connect the member routes
app.use('/api/members', memberRoutes);


// Start the server
app.listen(3000, () => {

    console.log('Server running at http://localhost:3000');

});