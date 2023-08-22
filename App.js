const express = require('express');
const bodyParser = require('body-parser');

const user = require('./routes/user');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Use the routes

app.use('/user', user);

// app.use('/lead', lead);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});