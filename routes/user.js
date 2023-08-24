const express = require('express');
const userHandler = require('../handlers/userHandler');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.post('/', userHandler.addUser);
router.post('/addUserColumn',userHandler.addUserColumn);
router.get('/:id', userHandler.getUserById);
router.put('/:id', userHandler.updateUserById);
router.delete('/:id', userHandler.deleteUserById);

module.exports = router;
