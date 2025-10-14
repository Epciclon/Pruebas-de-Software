const express = require('express');
const { getAllUsers, createUser} = require('../controller/user.controller');
const router = express.Router();

// ruta get para obtener todos los usuarios
router.get('/', getAllUsers);
// ruta post para crear un nuevo usuario
router.post('/', createUser);

module.exports = router;