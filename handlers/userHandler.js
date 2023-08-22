const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const userSchema = require('../schemas/userSchema.json');


const dataFilePath = path.join(__dirname, '..', './data/userData.json');


const ajv = new Ajv();
addFormats(ajv);

function validateUser(user) {
    const valid = ajv.validate(userSchema, user);
    if (!valid) 
    return ajv.errors;
    return null;
}

function readData() {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

exports.getAllUsers = (req, res) => {
    const users = readData();
    res.json(users);
};

exports.addUser = (req, res) => {
    const validationErrors = validateUser(req.body);
    if (validationErrors) {
        return res.status(200).json({ errors: validationErrors });
    }

    const users = readData();
    const newUser = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob
    };

    users.push(newUser);
    writeData(users);

    res.status(201).json(newUser);
};

exports.getUserById = (req, res) => {
    const users = readData();
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};

exports.updateUserById = (req, res) => {
    const users = readData();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));

    if (userIndex !== -1) {
        const updatedUser = {
            ...users[userIndex],
            name: req.body.name || users[userIndex].name,
            email: req.body.email || users[userIndex].email,
            dob: req.body.dob || users[userIndex].dob
        };

        const validationErrors = validateUser(updatedUser);
        if (validationErrors) {
            return res.status(400).json({ errors: validationErrors });
        }

        users[userIndex] = updatedUser;
        writeData(users);
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};

exports.deleteUserById = (req, res) => {
    const users = readData();
    const newUsers = users.filter(u => u.id !== parseInt(req.params.id));

    if (users.length !== newUsers.length) {
        writeData(newUsers);
        res.json({ message: 'User deleted successfully.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};
