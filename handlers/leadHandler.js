const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const leadSchema = require('../schemas/LeadSchema.json');

const dataFilePath = path.join(__dirname, '..', './data/leadData.json');

const ajv = new Ajv();
addFormats(ajv);

function validateUser(lead) {
    const valid = ajv.validate(leadSchema, lead);
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

exports.getAllLeads = (req, res) => {
    const leads = readData();
    res.json(leads);
};

exports.addLead = (req, res) => {
    const validationErrors = validateUser(req.body);
    if (validationErrors) {
        return res.status(200).json({ errors: validationErrors });
    }

    const leads = readData();
    const newLeadBody=req.body;
    
    const newLead = {
        id: Date.now(),
        ...newLeadBody
    };

    leads.push(newLead);
    writeData(leads);

    res.status(201).json(newLead);
};

exports.getLeadById = (req, res) => {
    const leads = readData();
    const lead = leads.find(u => u.id === parseInt(req.params.id));

    if (lead) {
        res.json(lead);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};

exports.updateLeadsById = (req, res) => {
    const leads = readData();
    const leadIndex = leads.findIndex(u => u.id === parseInt(req.params.id));

    if (leadIndex !== -1) {
        const updatedLead = {
            ...leads[leadIndex],
            leadName: req.body.leadName || leads[leadIndex].leadName,
            leadEmail: req.body.leadEmail || leads[leadIndex].leadEmail,
            leadContact: req.body.leadContact || leads[leadIndex].leadContact,
            leadBirthday: req.body.leadBirthday || leads[leadIndex].leadBirthday,

        };

        const validationErrors = validateUser(updatedLead);
        if (validationErrors) {
            return res.status(400).json({ errors: validationErrors });
        }

        leads[leadIndex] = updatedLead;
        writeData(leads);
        res.json(leads[leadIndex]);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};



exports.deleteLeadById = (req, res) => {
    const leads = readData();
    const newLeads = leads.filter(u => u.id !== parseInt(req.params.id));

    if (leads.length !== newLeads.length) {
        writeData(newLeads);
        res.json({ message: 'User deleted successfully.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};

exports.addLeadColumn = (req, res) => {
    try {
        const rawData = fs.readFileSync(dataFilePath);
        const data = JSON.parse(rawData);
        
        // Extract the key-value pair from the request body
        const [key, value] = Object.entries(req.body)[0];
        
        // Add the new key-value pair to each object
        const updatedData = data.map(obj => ({
            ...obj,
            [key]: value
        }));
    
        fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
        res.send({ success: true });
    } catch (error) {
        console.error("Error in addColumn:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};






