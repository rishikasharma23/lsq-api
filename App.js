const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors library

const user = require('./routes/user');
const lead= require('./routes/lead');

const app = express();
const port = 3000;

app.use(cors()); // Use cors middleware. This enables CORS for all routes and origins by default.

app.use(bodyParser.json());

// Use the routes
app.use('/user', user);
app.use('/lead', lead);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
